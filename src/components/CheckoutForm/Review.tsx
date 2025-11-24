import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import type { Order, PaymentInfo, ShippingInfo, User } from "../../types";
import { type STEP } from "../../utils/constants";
import { PAYMENT_METHODS } from "../../utils/constants";

const Review: React.FC<{
  user: User;
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  setStep: (step: STEP) => void;
}> = ({ user, paymentInfo, shippingInfo, setStep }) => {
  const { updateUser } = useAuth();
  const { cart, totalPrice, clearCart, setOrderData } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      await updateUser({
        ...user,
        phone: shippingInfo.phone,
        address: {
          address: shippingInfo.address,
          city: shippingInfo.detailedAddress,
          postalCode: shippingInfo.postalCode,
        },
      });

      const order: Order = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        total: totalPrice,
        shipping: shippingInfo,
        payment: paymentInfo,
      };
      setOrderData(order);

      navigate("/confirmation");
      clearCart();
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Order</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Shipping Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Name:</strong> {shippingInfo.fullName}
              </p>
              <p>
                <strong>Phone:</strong> {shippingInfo.phone}
              </p>
              <p>
                <strong>Email:</strong> {shippingInfo.email}
              </p>
              <p>
                <strong>Address:</strong> {shippingInfo.address},{" "}
                {shippingInfo.detailedAddress}
              </p>
              <p>
                <strong>Postal Code:</strong> {shippingInfo.postalCode}
              </p>
              {shippingInfo.deliveryNotes && (
                <p>
                  <strong>Notes:</strong> {shippingInfo.deliveryNotes}
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
            <div className="text-sm text-gray-600">
              {paymentInfo.paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                <>
                  <p>
                    <strong>Card:</strong> **** **** ****{" "}
                    {paymentInfo.cardNumber.slice(-4)}
                  </p>
                  <p>
                    <strong>Cardholder:</strong> {paymentInfo.cardName}
                  </p>
                </>
              )}
              {paymentInfo.paymentMethod ===
                PAYMENT_METHODS.CASH_ON_DELIVERY && <p>Cash On Delivery</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep("payment")}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Review;
