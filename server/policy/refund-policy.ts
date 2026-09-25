export const REFUND_POLICY = {
  refundWindowDays: 30,

  rules: [
    "The order must exist.",
    "The customer must own the order.",
    "The order must not be cancelled.",
    "The order must have been delivered.",
    "The refund request must be within 30 days of delivery.",
    "Every requested item must be refundable.",
    "The order must not already have a processed refund.",
    "The refund amount cannot exceed the eligible order amount.",
  ],
} as const;