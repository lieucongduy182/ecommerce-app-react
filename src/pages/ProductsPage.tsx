import { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { api } from '../services/api';
import Header from '../components/Header';
import { Search } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const  navigate  = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prev) => prev + 20);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts(skip, 20, search);
        setProducts((prev) =>
          skip === 0 ? data.products : [...prev, ...data.products],
        );
        setHasMore(data.products.length === 20);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [skip, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setSkip(0);
    setProducts([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage