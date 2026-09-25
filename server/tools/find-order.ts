import { prisma } from "../../lib/prisma";

export type FindOrderInput = {
  orderNumber: string;
  customerId?: string;
};

export async function findOrder({
  orderNumber,
  customerId,
}: FindOrderInput) {
  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: true,
      refunds: true,
    },
  });

  if (!order) {
    return {
      found: false,
      reason: "Order was not found.",
    };
  }

  if (customerId && order.customerId !== customerId) {
    return {
      found: false,
      reason: "This order does not belong to the customer.",
    };
  }

  return {
    found: true,
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount.toString(),
      orderedAt: order.orderedAt,
      deliveredAt: order.deliveredAt,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        isRefundable: item.isRefundable,
      })),
      refunds: order.refunds.map((refund) => ({
        id: refund.id,
        amount: refund.amount.toString(),
        status: refund.status,
        reason: refund.reason,
        processedAt: refund.processedAt,
      })),
    },
  };
}