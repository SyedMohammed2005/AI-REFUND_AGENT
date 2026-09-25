import {
  checkRefundEligibility as checkEligibility,
} from "../policy/check-refund-eligibility";

export type CheckRefundEligibilityInput = {
  customerId: string;
  orderId: string;
};

export async function checkRefundEligibility({
  customerId,
  orderId,
}: CheckRefundEligibilityInput) {
  return checkEligibility({
    customerId,
    orderId,
  });
}