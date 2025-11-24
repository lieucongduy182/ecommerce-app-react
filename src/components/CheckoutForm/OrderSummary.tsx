import { useCart } from "../../context/CartContext";

const OrderSummary: React.FC<{}> = () => {
  const { cart, totalPrice } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
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
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
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
          <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
