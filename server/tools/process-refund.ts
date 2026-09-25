import { prisma } from "../../lib/prisma";
import { checkRefundEligibility } from "../policy/check-refund-eligibility";

export type ProcessRefundInput = {
  customerId: string;
  orderId: string;
  reason: string;
};

export async function processRefund({
  customerId,
  orderId,
  reason,
}: ProcessRefundInput) {
  const eligibility = await checkRefundEligibility({
    customerId,
    orderId,
  });

  if (!eligibility.eligible) {
    return {
      success: false,
      status: "DENIED" as const,
      reason: eligibility.reason,
    };
  }

  const existingRefund = await prisma.refund.findUnique({
    where: {
      orderId,
    },
  });

  if (existingRefund) {
    return {
      success: false,
      status: "DENIED" as const,
      reason: "A refund already exists for this order.",
    };
  }

  const refund = await prisma.refund.create({
    data: {
      customerId,
      orderId,
      amount: eligibility.refundAmount,
      status: "PROCESSED",
      reason,
      processedAt: new Date(),
    },
  });

  return {
    success: true,
    status: "PROCESSED" as const,
    refund: {
      id: refund.id,
      orderId: refund.orderId,
      amount: refund.amount.toString(),
      status: refund.status,
    },
  };
}