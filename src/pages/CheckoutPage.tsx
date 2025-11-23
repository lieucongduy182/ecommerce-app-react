import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import type { Order, PaymentInfo, ShippingInfo } from '../types';
import {
  formatCardNumber,
  formatExpiryDate,
  validateEmail,
  validatePhone,
} from '../utils';
import { api } from '../services/api';

const CheckoutPage: React.FC<{}> = () => {
  const { user, updateUser, token } = useAuth();
  const { cart, totalPrice, clearCart, setOrderData } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>(
    'shipping',
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    phone: user?.phone || '',
    email: user?.email || '',
    postalCode: user?.address?.postalCode || '',
    address: user?.address?.address || '',
    detailedAddress: '',
    deliveryNotes: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!validatePhone(shippingInfo.phone))
      newErrors.phone = 'Invalid phone number';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(shippingInfo.email))
      newErrors.email = 'Invalid email address';
    if (!shippingInfo.postalCode.trim())
      newErrors.postalCode = 'Postal code is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.detailedAddress.trim())
      newErrors.detailedAddress = 'Detailed address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (paymentInfo.paymentMethod === 'card') {
      if (!paymentInfo.cardNumber.trim())
        newErrors.cardNumber = 'Card number is required';
      else if (paymentInfo.cardNumber.replace(/\D/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!paymentInfo.expiryDate.trim())
        newErrors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (paymentInfo.cvv.length !== 3)
        newErrors.cvv = 'CVV must be 3 digits';
      if (!paymentInfo.cardName.trim())
        newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingNext = () => {
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const handlePaymentNext = () => {
    if (validatePayment()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call to update user info
      await fetch(`https://dummyjson.com/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            address: shippingInfo.address,
            city: shippingInfo.detailedAddress,
            postalCode: shippingInfo.postalCode,
          },
          phone: shippingInfo.phone,
        }),
      });

      await api.updateUser(
        user?.id,
        {
          address: {
            address: shippingInfo.address,
            city: shippingInfo.detailedAddress,
            postalCode: shippingInfo.postalCode,
          },
          phone: shippingInfo.phone,
        },
        token!,
      );

      if (user) {
        updateUser({
          ...user,
          phone: shippingInfo.phone,
          address: {
            address: shippingInfo.address,
            city: shippingInfo.detailedAddress,
            postalCode: shippingInfo.postalCode,
          },
        });
      }

      // Create order object
      const order: Order = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        total: totalPrice,
        shipping: shippingInfo,
        payment: paymentInfo,
      };

      setOrderData(order);

      clearCart();
      navigate('/confirmation');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/cart')}
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
                  step === 'shipping' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    step === 'shipping'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200'
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
                  step !== 'shipping' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-center ${
                  step === 'payment' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    step === 'payment'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200'
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
                  step === 'review' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-center ${
                  step === 'review' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    step === 'review'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Review</span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          fullName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        postalCode: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Address *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.detailedAddress}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        detailedAddress: e.target.value,
                      })
                    }
                    placeholder="Apartment, suite, unit, etc."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.detailedAddress
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.detailedAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.detailedAddress}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    value={shippingInfo.deliveryNotes}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        deliveryNotes: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Special instructions for delivery"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleShippingNext}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment Form */}
          {step === 'payment' && (
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
                          paymentMethod: 'card',
                        })
                      }
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        paymentInfo.paymentMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Card</span>
                    </button>
                    <button
                      onClick={() =>
                        setPaymentInfo({
                          ...paymentInfo,
                          paymentMethod: 'paypal',
                        })
                      }
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        paymentInfo.paymentMethod === 'paypal'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 bg-blue-600 rounded" />
                      <span className="text-sm font-medium">PayPal</span>
                    </button>
                    <button
                      onClick={() =>
                        setPaymentInfo({
                          ...paymentInfo,
                          paymentMethod: 'bank',
                        })
                      }
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        paymentInfo.paymentMethod === 'bank'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 bg-green-600 rounded" />
                      <span className="text-sm font-medium">Bank</span>
                    </button>
                  </div>
                </div>

                {paymentInfo.paymentMethod === 'card' && (
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
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardName}
                        </p>
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
                          errors.cardNumber
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardNumber}
                        </p>
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
                            errors.expiryDate
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                            const value = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 3);
                            setPaymentInfo({ ...paymentInfo, cvv: value });
                          }}
                          placeholder="123"
                          maxLength={3}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {paymentInfo.paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </div>
                )}

                {paymentInfo.paymentMethod === 'bank' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700">
                      You will be redirected to your bank to complete the
                      payment.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep('shipping')}
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
          )}

          {/* Review Order */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Review Order
                </h2>

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
                        <strong>Address:</strong> {shippingInfo.address},{' '}
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
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Payment Method
                    </h3>
                    <div className="text-sm text-gray-600">
                      {paymentInfo.paymentMethod === 'card' && (
                        <>
                          <p>
                            <strong>Card:</strong> **** **** ****{' '}
                            {paymentInfo.cardNumber.slice(-4)}
                          </p>
                          <p>
                            <strong>Cardholder:</strong> {paymentInfo.cardName}
                          </p>
                        </>
                      )}
                      {paymentInfo.paymentMethod === 'paypal' && <p>PayPal</p>}
                      {paymentInfo.paymentMethod === 'bank' && (
                        <p>Bank Transfer</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-indigo-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
