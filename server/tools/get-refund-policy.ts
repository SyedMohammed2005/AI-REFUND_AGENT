import { REFUND_POLICY } from "../policy/refund-policy";

export function getRefundPolicy() {
  return {
    refundWindowDays: REFUND_POLICY.refundWindowDays,
    rules: [...REFUND_POLICY.rules],
  };
}