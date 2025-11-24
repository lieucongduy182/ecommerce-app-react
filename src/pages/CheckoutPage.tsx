import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import type { PaymentInfo, ShippingInfo } from "../types";
import { PAYMENT_METHODS, STEPS, type STEP } from "../utils/constants";
import Shipping from "../components/CheckoutForm/Shipping";
import Payment from "../components/CheckoutForm/Payment";
import Review from "../components/CheckoutForm/Review";
import OrderSummary from "../components/CheckoutForm/OrderSummary";

const CheckoutPage: React.FC<{}> = () => {
  const { user,  } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<STEP>(STEPS.SHIPPING);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    phone: user?.phone || "",
    email: user?.email || "",
    postalCode: user?.address?.postalCode || "",
    address: user?.address?.address || "",
    detailedAddress: "",
    deliveryNotes: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  if (!user) return null;

  const isShippingStep = step === STEPS.SHIPPING;
  const isPaymentStep = step === STEPS.PAYMENT;
  const isReviewStep = step === STEPS.REVIEW;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div
                className={`text-center ${
                  isShippingStep ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    isShippingStep ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Shipping</span>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full ${
                  !isShippingStep ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-center ${
                  isPaymentStep ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    isPaymentStep ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Payment</span>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full ${
                  isReviewStep ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-center ${
                  isReviewStep ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    isReviewStep ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Review</span>
              </div>
            </div>
          </div>

          {isShippingStep && (
            <Shipping
              user={user}
              setStep={setStep}
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
            />
          )}
          {isPaymentStep && (
            <Payment
              user={user}
              setStep={setStep}
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
            />
          )}
          {isReviewStep && (
            <Review
              user={user}
              paymentInfo={paymentInfo}
              shippingInfo={shippingInfo}
              setStep={setStep}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
