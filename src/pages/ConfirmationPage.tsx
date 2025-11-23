import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

const ConfirmationPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { orderData } = useCart();

  useEffect(() => {
    if (!orderData) navigate('/products');
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-sm text-gray-600 mb-2">Order Number</div>
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {orderData.orderId}
          </div>

          <div className="text-sm text-gray-600 mb-2">Total Amount</div>
          <div className="text-3xl font-bold text-indigo-600">
            ${orderData.total}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          A confirmation email has been sent to your email address. You can
          track your order status in your account.
        </p>

        <button
          onClick={() => navigate('/products')}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
