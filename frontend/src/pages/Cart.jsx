import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { resolveImageUrl } from "../utils/imageUrl";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");

      console.log("BACKEND RESPONSE:", response.data);

      const fetchedData = response.data?.data || response.data;

      if (Array.isArray(fetchedData)) {
        setCartItems(fetchedData);
      }
     
      else if (fetchedData && Array.isArray(fetchedData.items)) {
        setCartItems(fetchedData.items);
      }
      
      else if (fetchedData && Array.isArray(fetchedData.cartItems)) {
        setCartItems(fetchedData.cartItems);
      }
      
      else if (fetchedData && Array.isArray(fetchedData.CartItems)) {
        setCartItems(fetchedData.CartItems);
      } else {
        console.log("Unexpected data format received:", fetchedData);
        setCartItems([]);
      }
    } catch (error) {
      console.log("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.log("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(`/cart/${cartItemId}`, { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      console.log("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;

    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(
        item.product?.price || item.Product?.price || 0,
      );
      const itemQuantity = parseInt(item.quantity || 1, 10);
      return total + itemPrice * itemQuantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center pt-20">
        <p>Loading Cart...</p>
      </div>
    );
  }

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-28 pb-16 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      {safeCartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-medium text-gray-600 mb-4">
            Your cart is empty
          </h2>
          <Link
            to="/"
            className="bg-[#8CC63F] text-white px-8 py-3 rounded font-medium hover:bg-[#7ab036] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 flex flex-col gap-6">
            {safeCartItems.map((item) => {
              const productDetail = item.product || item.Product || {};
              const images = productDetail.images || productDetail.Images || [];
              const price = parseFloat(productDetail.price || 0);

              return (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 border border-gray-200 p-3 sm:p-4 rounded-lg bg-white shadow-sm relative"
                >
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={resolveImageUrl(images[0])}
                    alt={productDetail.title || "Product"}
                    className="w-20 h-28 sm:w-28 sm:h-36 shrink-0 object-cover rounded border border-gray-100"
                  />

                  <div className="flex flex-col justify-between py-1 sm:py-2 flex-1 pr-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">
                        {productDetail.title || "Unknown Product"}
                      </h3>
                      <p className="text-[#8CC63F] font-medium text-sm mt-1">
                        Rs. {price}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100 font-medium text-gray-600"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r border-gray-300 bg-gray-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100 font-medium text-gray-600"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-base sm:text-lg">
                        Rs. {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[350px]">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 sm:p-6 lg:sticky lg:top-28 shadow-sm">
              <h2 className="text-xl font-bold border-b border-gray-300 pb-4 mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3 text-gray-600">
                <span>Subtotal ({safeCartItems.length} items)</span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span className="text-sm italic">Calculated at checkout</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-4 mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-[#8CC63F]">
                  Rs. {calculateTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors shadow-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
