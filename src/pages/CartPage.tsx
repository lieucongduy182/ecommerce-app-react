import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">${item.price}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 mb-3">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;
