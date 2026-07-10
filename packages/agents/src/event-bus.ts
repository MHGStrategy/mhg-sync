import { randomUUID } from "node:crypto";
import { Queue, Worker, type Job } from "bullmq";
import { query } from "@mhg-sync/db";
import { connectRedis } from "@mhg-sync/memory";
import type { AgentDomain, EventHandler, SyncEvent } from "./types.js";
import { logger } from "./logger.js";

const QUEUE_NAME = "mhg-sync-events";

function redisConnection() {
  return {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
}

export class EventBus {
  private queue: Queue | null = null;
  private worker: Worker | null = null;
  private handlers = new Map<string, Set<EventHandler>>();

  async start(): Promise<void> {
    if (process.env.SKIP_REDIS_EVENTS === "true") {
      return;
    }
    await connectRedis();
    const connection = redisConnection();

    this.queue = new Queue(QUEUE_NAME, { connection });

    this.worker = new Worker(
      QUEUE_NAME,
      async (job: Job<SyncEvent>) => {
        await this.dispatch(job.data);
      },
      { connection },
    );

    this.worker.on("failed", (job, err) => {
      logger.error("event-bus", job?.id ?? "unknown", "Worker job failed", undefined, err.message);
    });
  }

  async stop(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
    this.worker = null;
    this.queue = null;
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler);
  }

  subscribeMany(eventTypes: string[], handler: EventHandler): void {
    for (const type of eventTypes) {
      this.subscribe(type, handler);
    }
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    this.handlers.get(eventType)?.delete(handler);
  }

  async publish(partial: {
    tenantId: string;
    source: AgentDomain | "user" | "system" | "scheduler";
    eventType: string;
    payload: Record<string, unknown>;
    correlationId?: string;
  }): Promise<SyncEvent> {
    const event: SyncEvent = {
      id: randomUUID(),
      tenantId: partial.tenantId,
      source: partial.source,
      eventType: partial.eventType,
      payload: partial.payload,
      timestamp: new Date(),
      processed: false,
      correlationId: partial.correlationId,
    };

    await query(
      `INSERT INTO events (id, tenant_id, source, event_type, payload, processed, correlation_id, occurred_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        event.id,
        event.tenantId,
        event.source,
        event.eventType,
        JSON.stringify(event.payload),
        false,
        event.correlationId ?? null,
        event.timestamp.toISOString(),
      ],
      ["system"],
    );

    if (!this.queue) {
      void this.dispatch(event).catch((err) => {
        logger.error("event-bus", event.id, "Inline dispatch failed", undefined, String(err));
      });
      return event;
    }

    await this.queue.add(event.eventType, event, {
      jobId: event.id,
      removeOnComplete: 100,
      removeOnFail: 500,
    });

    return event;
  }

  private async dispatch(event: SyncEvent): Promise<void> {
    const traceId = event.correlationId ?? event.id;
    logger.info("event-bus", traceId, `Dispatching ${event.eventType}`, { source: event.source });

    const handlers = this.handlers.get(event.eventType);
    if (handlers) {
      for (const handler of handlers) {
        await handler(event);
      }
    }

    await query(
      `UPDATE events SET processed = true WHERE id = $1`,
      [event.id],
      ["system"],
    );
  }
}

export const eventBus = new EventBus();
