import { prisma } from "../../lib/prisma";

type AgentLogInput = {
  sessionId: string;
  customerId?: string;
  orderId?: string;
  event: string;
  toolName?: string;
  status: "STARTED" | "SUCCESS" | "FAILED";
  details?: Record<string, unknown>;
};

export async function createAgentLog({
  sessionId,
  customerId,
  orderId,
  event,
  toolName,
  status,
  details,
}: AgentLogInput) {
  return prisma.agentLog.create({
    data: {
      sessionId,
      customerId,
      orderId,
      event,
      toolName,
      status,
      details: details
        ? JSON.parse(JSON.stringify(details))
        : undefined,
    },
  });
}
