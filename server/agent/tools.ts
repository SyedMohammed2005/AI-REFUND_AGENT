import { findCustomer } from "../tools/find-customer";
import { findOrder } from "../tools/find-order";
import { getRefundPolicy } from "../tools/get-refund-policy";
import { checkRefundEligibility } from "../tools/check-refund-eligibility";
import { processRefund } from "../tools/process-refund";

export const refundAgentTools = {
  findCustomer,
  findOrder,
  getRefundPolicy,
  checkRefundEligibility,
  processRefund,
};