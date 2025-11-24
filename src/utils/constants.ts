export const STEPS = {
  SHIPPING: "shipping",
  PAYMENT: "payment",
  REVIEW: "review",
} as const;

export type STEP = (typeof STEPS)[keyof typeof STEPS];

export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  CASH_ON_DELIVERY: "cash_on_delivery",
} as const;