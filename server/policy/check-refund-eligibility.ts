import { prisma } from "../../lib/prisma";
import { REFUND_POLICY } from "./refund-policy";

type RefundEligibilityInput = {
  customerId: string;
  orderId: string;
};

export type RefundEligibilityResult =
  | {
      eligible: true;
      orderId: string;
      orderNumber: string;
      refundAmount: string;
      reason: string;
    }
  | {
      eligible: false;
      orderId?: string;
      orderNumber?: string;
      refundAmount?: string;
      reason: string;
    };

export async function checkRefundEligibility({
  customerId,
  orderId,
}: RefundEligibilityInput): Promise<RefundEligibilityResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      refunds: true,
    },
  });

  if (!order) {
    return {
      eligible: false,
      reason: "Order was not found.",
    };
  }

  if (order.customerId !== customerId) {
    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: "This order does not belong to the customer.",
    };
  }

  if (order.status === "CANCELLED") {
    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: "Cancelled orders are not eligible for refunds.",
    };
  }

  if (order.status !== "DELIVERED" || !order.deliveredAt) {
    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: "Only delivered orders are eligible for refunds.",
    };
  }

  const now = new Date();

  const refundDeadline = new Date(order.deliveredAt);

  refundDeadline.setDate(
    refundDeadline.getDate() + REFUND_POLICY.refundWindowDays,
  );

  if (now > refundDeadline) {
    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: `The ${REFUND_POLICY.refundWindowDays}-day refund window has expired.`,
    };
  }

  const nonRefundableItem = order.items.find(
    (item) => !item.isRefundable,
  );

  if (nonRefundableItem) {
    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: `The item "${nonRefundableItem.productName}" is non-refundable.`,
    };
  }

  const processedRefund = order.refunds.find(
    (refund) => refund.status === "PROCESSED",
  );

  if (processedRefund) {
    const processedDate =
      processedRefund.processedAt?.toISOString() ?? null;

    return {
      eligible: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: processedDate
        ? `A refund has already been processed for this order. Refund processed at ${processedDate}.`
        : "A refund has already been processed for this order.",
    };
  }

  return {
    eligible: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    refundAmount: order.totalAmount.toString(),
    reason: "Order satisfies all refund policy requirements.",
  };
}