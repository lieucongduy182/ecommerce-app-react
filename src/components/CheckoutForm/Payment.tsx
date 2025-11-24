import { CreditCard } from "lucide-react";
import React, { useState } from "react";
import type { PaymentInfo, User } from "../../types";
import { formatCardNumber, formatExpiryDate } from "../../utils";
import { PAYMENT_METHODS, STEPS, type STEP } from "../../utils/constants";

interface Props {
  user: User;
  setStep: (step: STEP) => void;
  paymentInfo: PaymentInfo;
  setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfo>>;
}

const Payment: React.FC<Props> = ({
  user,
  setStep,
  paymentInfo,
  setPaymentInfo,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (paymentInfo.paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
      if (!paymentInfo.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      else if (paymentInfo.cardNumber.replace(/\D/g, "").length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!paymentInfo.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        newErrors.expiryDate = "Invalid format (MM/YY)";
      }
      if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (paymentInfo.cvv.length !== 3)
        newErrors.cvv = "CVV must be 3 digits";
      if (!paymentInfo.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentNext = () => {
    if (validatePayment()) {
      setStep(STEPS.REVIEW);
    }
  };

  const isCreditCardSelected =
    paymentInfo.paymentMethod === PAYMENT_METHODS.CREDIT_CARD;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Payment Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() =>
                setPaymentInfo({
                  ...paymentInfo,
                  paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
                })
              }
              className={`p-4 border-2 rounded-lg text-center transition ${
                isCreditCardSelected
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Credit Card</span>
            </button>

            <button
              onClick={() =>
                setPaymentInfo({
                  ...paymentInfo,
                  paymentMethod: PAYMENT_METHODS.CASH_ON_DELIVERY,
                })
              }
              className={`p-4 border-2 rounded-lg text-center transition ${
                paymentInfo.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="w-6 h-6 mx-auto mb-2 bg-green-600 rounded" />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </button>
          </div>
        </div>

        {isCreditCardSelected && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentInfo.cardName}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    cardName: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.cardName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentInfo.cardNumber}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                placeholder="1234-5678-9012-3456"
                maxLength={19}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      expiryDate: formatExpiryDate(e.target.value),
                    })
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                    setPaymentInfo({ ...paymentInfo, cvv: value });
                  }}
                  placeholder="123"
                  maxLength={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </>
        )}

        {paymentInfo.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              You have selected Cash on Delivery. Please prepare the exact
              amount.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep(STEPS.SHIPPING)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={handlePaymentNext}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Review Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
