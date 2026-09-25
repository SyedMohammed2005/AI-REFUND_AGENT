import { findCustomer } from "../tools/find-customer";
import { findOrder } from "../tools/find-order";
import { getRefundPolicy } from "../tools/get-refund-policy";
import { checkRefundEligibility } from "../tools/check-refund-eligibility";
import { processRefund } from "../tools/process-refund";
import { createAgentLog } from "../services/agent-logger";

export type RefundWorkflowInput = {
  email: string;
  orderNumber: string;
  reason: string;
  sessionId?: string;
};

export async function runRefundWorkflow({
  email,
  orderNumber,
  reason,
  sessionId = crypto.randomUUID(),
}: RefundWorkflowInput) {
  const steps = [];

  await createAgentLog({
    sessionId,
    event: "refund_workflow_started",
    status: "STARTED",
    details: { email, orderNumber },
  });

  // 1. Find customer
  const customerResult = await findCustomer({ email });

  if (!customerResult.found || !customerResult.customer) {
    await createAgentLog({
      sessionId,
      event: "customer_lookup",
      toolName: "find_customer",
      status: "FAILED",
      details: { reason: customerResult.reason },
    });

    return {
      success: false,
      status: "DENIED" as const,
      message: customerResult.reason,
      sessionId,
      steps: [
        {
          tool: "find_customer",
          status: "FAILED",
          details: customerResult.reason,
        },
      ],
    };
  }

  const customer = customerResult.customer;

  steps.push({
    tool: "find_customer",
    status: "SUCCESS",
    details: `Customer ${customer.customerNumber} found.`,
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    event: "customer_lookup",
    toolName: "find_customer",
    status: "SUCCESS",
    details: {
      customerNumber: customer.customerNumber,
    },
  });

  // 2. Find order
  const orderResult = await findOrder({
    orderNumber,
    customerId: customer.id,
  });

  if (!orderResult.found || !orderResult.order) {
    await createAgentLog({
      sessionId,
      customerId: customer.id,
      event: "order_lookup",
      toolName: "find_order",
      status: "FAILED",
      details: { reason: orderResult.reason },
    });

    return {
      success: false,
      status: "DENIED" as const,
      message: orderResult.reason,
      sessionId,
      steps: [
        ...steps,
        {
          tool: "find_order",
          status: "FAILED",
          details: orderResult.reason,
        },
      ],
    };
  }

  const order = orderResult.order;

  steps.push({
    tool: "find_order",
    status: "SUCCESS",
    details: `Order ${order.orderNumber} found.`,
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    orderId: order.id,
    event: "order_lookup",
    toolName: "find_order",
    status: "SUCCESS",
    details: {
      orderNumber: order.orderNumber,
      status: order.status,
    },
  });

  // 3. Load policy
  const policy = getRefundPolicy();

  steps.push({
    tool: "get_refund_policy",
    status: "SUCCESS",
    details: `${policy.refundWindowDays}-day refund policy loaded.`,
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    orderId: order.id,
    event: "policy_loaded",
    toolName: "get_refund_policy",
    status: "SUCCESS",
    details: {
      refundWindowDays: policy.refundWindowDays,
    },
  });

  // 4. Check eligibility
  const eligibility = await checkRefundEligibility({
    customerId: customer.id,
    orderId: order.id,
  });

  if (!eligibility.eligible) {
    await createAgentLog({
      sessionId,
      customerId: customer.id,
      orderId: order.id,
      event: "refund_eligibility",
      toolName: "check_refund_eligibility",
      status: "FAILED",
      details: {
        reason: eligibility.reason,
      },
    });

    return {
      success: false,
      status: "DENIED" as const,
      message: eligibility.reason,
      sessionId,
      steps: [
        ...steps,
        {
          tool: "check_refund_eligibility",
          status: "FAILED",
          details: eligibility.reason,
        },
      ],
    };
  }

  steps.push({
    tool: "check_refund_eligibility",
    status: "SUCCESS",
    details: eligibility.reason,
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    orderId: order.id,
    event: "refund_eligibility",
    toolName: "check_refund_eligibility",
    status: "SUCCESS",
    details: {
      reason: eligibility.reason,
      refundAmount: eligibility.refundAmount,
    },
  });

  // 5. Process refund
  const refundResult = await processRefund({
    customerId: customer.id,
    orderId: order.id,
    reason,
  });

  if (!refundResult.success || !refundResult.refund) {
    await createAgentLog({
      sessionId,
      customerId: customer.id,
      orderId: order.id,
      event: "refund_processing",
      toolName: "process_refund",
      status: "FAILED",
      details: {
        reason: refundResult.reason,
      },
    });

    return {
      success: false,
      status: "DENIED" as const,
      message: refundResult.reason,
      sessionId,
      steps: [
        ...steps,
        {
          tool: "process_refund",
          status: "FAILED",
          details: refundResult.reason,
        },
      ],
    };
  }

  steps.push({
    tool: "process_refund",
    status: "SUCCESS",
    details: `Refund of ${refundResult.refund.amount} processed.`,
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    orderId: order.id,
    event: "refund_processing",
    toolName: "process_refund",
    status: "SUCCESS",
    details: {
      refundId: refundResult.refund.id,
      amount: refundResult.refund.amount,
    },
  });

  await createAgentLog({
    sessionId,
    customerId: customer.id,
    orderId: order.id,
    event: "refund_workflow_completed",
    status: "SUCCESS",
    details: {
      status: "PROCESSED",
      refundId: refundResult.refund.id,
    },
  });

  return {
    success: true,
    status: "PROCESSED" as const,
    message: `Refund processed successfully for order ${order.orderNumber}.`,
    sessionId,
    refund: refundResult.refund,
    steps,
  };
}