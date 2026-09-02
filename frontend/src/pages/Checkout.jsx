import Logo from "../assets/hm-logo.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        const fetchedData = response.data?.data || response.data;

        if (Array.isArray(fetchedData)) {
          setCartItems(fetchedData);
        } else if (fetchedData && Array.isArray(fetchedData.items)) {
          setCartItems(fetchedData.items);
        } else if (fetchedData && Array.isArray(fetchedData.cartItems)) {
          setCartItems(fetchedData.cartItems);
        } else if (fetchedData && Array.isArray(fetchedData.CartItems)) {
          setCartItems(fetchedData.CartItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.log("Error fetching cart for checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(
        item.product?.price || item.Product?.price || 0,
      );
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 249 : 0;
  const total = subtotal + shipping;

  const handleCompleteOrder = async () => {
    if (!formData.address || !formData.city || !formData.phone) {
      showNotification(
        "Please fill in your Address, City, and Phone number.",
        "error",
      );
      return;
    }

    setPlacingOrder(true);
    try {
      const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.postalCode}. Phone: ${formData.phone}`;

      await api.post("/orders", { shippingAddress });

      showNotification("Order Placed Successfully!", "success");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("Order error:", error);
      showNotification(
        error.response?.data?.message || "Failed to place order.",
        "error",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading Checkout...</p>
      </div>
    );

  return (
    <>
      {toast.show && (
        <div
          className={`fixed top-24 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === "success" ? "bg-[#8CC63F]" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <header className="checkout-header">
        <img
          src={Logo}
          alt="Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </header>

      <div className="checkout-container">
        <div className="checkout-form">
          <div className="checkout-section">
            <div className="section-title">
              <h2>Contact</h2>
            </div>
            <div className="login-email">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Delivery</h2>
            <select className="checkout-input">
              <option>Pakistan</option>
            </select>
            <div className="two-col">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="checkout-input"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="checkout-input"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="checkout-input"
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className="two-col">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="checkout-input"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal code (optional)"
                className="checkout-input"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="checkout-input"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="checkout-section">
            <h2>Shipping method</h2>
            <div className="shipping-method">
              <span>Standard Shipping</span>
              <strong>Rs. 249.00</strong>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment</h2>
            <p className="payment-note">
              All transactions are secure and encrypted.
            </p>
            <div className="payment-options">
              <label
                className={`payment-option ${paymentMethod === "cod" ? "active-payment" : ""}`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="ml-2">Cash On Delivery</span>
              </label>
              <label
                className={`payment-option ${paymentMethod === "payfast" ? "active-payment" : ""}`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "payfast"}
                  onChange={() => setPaymentMethod("payfast")}
                />
                <span className="ml-2">PAYFAST (Debit/Credit/Wallet/Bank)</span>
              </label>
            </div>
          </div>

          <button
            className="complete-order disabled:bg-gray-400"
            onClick={handleCompleteOrder}
            disabled={placingOrder || cartItems.length === 0}
          >
            {placingOrder ? "Processing..." : "Complete order"}
          </button>
        </div>

        <div className="order-summary">
          <div className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => {
              const productDetail = item.product || item.Product || {};
              const images = productDetail.images || productDetail.Images || [];
              const price = parseFloat(productDetail.price || 0);

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={
                      images[0]?.image
                        ? images[0].image.startsWith("http")
                          ? images[0].image
                          : `http://localhost:3000${images[0].image}`
                        : "/placeholder.png"
                    }
                    alt={productDetail.title}
                    className="w-16 h-16 object-cover rounded-md" 
                  />

                  <div className="cart-item-info">
                    <p className="font-medium">{productDetail.title}</p>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                  </div>
                  <div className="cart-item-price">
                    Rs. {(price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cost-summary">
            <div className="cost-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="cost-row">
              <span>Shipping</span>
              <span>Rs. {shipping.toFixed(2)}</span>
            </div>
            <div className="cost-row total-row mt-2 pt-2 border-t border-[#E2E2E2]">
              <strong className="text-xl">Total</strong>
              <strong className="text-xl">Rs. {total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
