import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, ShoppingCart, LogOut } from 'lucide-react';

const Header: React.FC<{ title?: string; showCart?: boolean }> = ({
  title = 'E-Commerce',
  showCart = true,
}) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/products')}
          >
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Hi, {user.firstName}
              </span>
            )}
            {showCart && user && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
