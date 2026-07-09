import {
  bootstrapAgents,
  deadLetterQueue,
  eventBus,
  logger,
  startScheduler,
  type TenantContext,
} from "@mhg-sync/agents";
import { registerAllTools } from "@mhg-sync/tools";
import { setTrustCheckFn } from "@mhg-sync/llm";

import { startKnowledgeWorker } from "@mhg-sync/knowledge";
import { startCollectionsWorker, startOpsRiskWorker } from "@mhg-sync/tools";
import {
  setupIntegrationSubscribers,
  startIntegrationWorker,
} from "@mhg-sync/integrations";

async function probeRedis(timeoutMs = 3000): Promise<boolean> {
  if (process.env.SKIP_REDIS_EVENTS === "true") return false;
  try {
    const { connectRedis } = await import("@mhg-sync/memory");
    await Promise.race([
      (async () => {
        const redis = await connectRedis();
        await redis.ping();
      })(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Redis probe timeout")), timeoutMs),
      ),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function bootstrap(tenant: TenantContext): Promise<void> {
  const redisOk = await probeRedis();
  if (!redisOk) {
    process.env.SKIP_REDIS_EVENTS = "true";
    logger.warn(
      "bootstrap",
      "startup",
      "Redis unavailable — SKIP_REDIS_EVENTS enabled (intake webhook + inline CRM sync still active)",
    );
  }

  registerAllTools();

  const { trustEngine } = await import("@mhg-sync/agents");
  setTrustCheckFn(async (params) => {
    const result = await trustEngine.checkAction(params);
    return {
      allowed: result.allowed,
      autoExecuted: result.autoExecuted,
      pendingApprovalId: result.pendingApprovalId,
      reason: result.reason,
    };
  });

  deadLetterQueue.setEventBus(eventBus);
  await eventBus.start();
  setupIntegrationSubscribers(eventBus);
  await startIntegrationWorker();
  await startKnowledgeWorker();
  await startCollectionsWorker();
  await startOpsRiskWorker();
  const orchestrator = bootstrapAgents(tenant);
  await startScheduler(tenant.tenantId);
  const domains = orchestrator.getRegisteredDomains();
  logger.info("bootstrap", "startup", `MHG SYNC Core started with ${domains.length} agents`, {
    agents: domains,
  });
}
