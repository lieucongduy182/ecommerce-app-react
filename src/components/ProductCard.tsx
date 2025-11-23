import { useState } from 'react';
import type { Product } from '../types';
import { CheckCircle, Plus } from 'lucide-react';

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
}> = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="text-xs text-indigo-600 font-semibold mb-1">
          {product.category}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
