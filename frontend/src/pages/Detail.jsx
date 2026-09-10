import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { resolveImageUrl as resolveImage } from "../utils/imageUrl";

export default function Detail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("Small");
  const [showDescription, setShowDescription] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const sizes = ["X-Small", "Small", "Medium", "Large", "X-Large"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        setActiveImage(0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    let success = false;
    try {
      await api.post("/cart", {
        productId: product.id,
        quantity: quantity,
      });
      showNotification("Product added to cart successfully!", "success");
      success = true;
    } catch (error) {
      console.log("Error adding to cart:", error);
      showNotification(
        error.response?.data?.message || "Please login to add to cart",
        "error",
      );
    } finally {
      setAddingToCart(false);
    }
    return success; 
  };

  if (loading) return <p className="pt-28 px-5">Loading...</p>;

  if (!product) return <p className="pt-28 px-5">Product not found</p>;

  const galleryImages = product.images?.length ? product.images : [null];
  const hasMultipleImages = galleryImages.length > 1;

  const showImage = (nextIndex) => {
    setActiveImage(
      (nextIndex + galleryImages.length) % galleryImages.length,
    );
  };

  return (
    <>
      {toast.show && (
        <div
          className={`fixed top-24 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-sm px-4 sm:px-6 py-3 rounded-lg shadow-lg text-white text-sm sm:text-base font-medium z-[80] transition-all duration-300 transform translate-y-0 opacity-100 ${
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

      <div className="detail-container">
        <div className="detail-gallery">
          <div className="relative w-full flex justify-center overflow-hidden rounded-lg shadow bg-white">
            <img
              src={resolveImage(galleryImages[activeImage])}
              alt={product.title}
              className="w-full max-h-[70vh] object-contain"
            />

            {hasMultipleImages && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={() => showImage(activeImage - 1)}
                  aria-label="Previous image"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-black transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => showImage(activeImage + 1)}
                  aria-label="Next image"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-black transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}

            {hasMultipleImages && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-xs font-medium">
                {activeImage + 1} / {galleryImages.length}
              </span>
            )}
          </div>

          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, index) => (
                <button
                  key={img?.id ?? index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 transition-colors ${
                    index === activeImage
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={resolveImage(img)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-images">
          {(product.images || []).map((img, index) => (
            <img
              key={img.id}
              id={index === 2 || index === 5 ? "detail-images-full" : undefined}
              src={resolveImage(img)}
              alt={product.title}
            />
          ))}
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>

          {product.stock <= 5 && (
            <p className="stock">
              Hurry only <strong>{product.stock} items left</strong> in stock!
            </p>
          )}

          <h2>Rs. {product.price}</h2>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => setShowDescription(!showDescription)}
            >
              <h4>Product Description</h4>
              <span>{showDescription ? "-" : "+"}</span>
            </div>
            {showDescription && (
              <div className="accordion-body">
                <p>{product.description}</p>
                <p>Category: {product.category?.name}</p>
              </div>
            )}
          </div>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => setShowDelivery(!showDelivery)}
            >
              <h4>Estimated Delivery</h4>
              <span>{showDelivery ? "-" : "+"}</span>
            </div>
            {showDelivery && (
              <div className="accordion-body">
                <div className="delivery-row">
                  <p>Karachi / Lahore</p>
                  <strong>24-48 hrs</strong>
                </div>
                <div className="delivery-row">
                  <p>Major Cities</p>
                  <strong>3-4 Days</strong>
                </div>
                <div className="delivery-row">
                  <p>Rest of Pakistan</p>
                  <strong>4-5 Days</strong>
                </div>
              </div>
            )}
          </div>

          <div className="quantity">
            <button
              onClick={() => {
                if (quantity > 1) setQuantity(quantity - 1);
              }}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="sizes">
            <h3>Women Sizes</h3>
            <div className="size-buttons">
              {sizes.map((item) => (
                <button
                  key={item}
                  className={size === item ? "active-size" : ""}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button className="size-chart">Size Chart</button>

          <button
            className="add-cart"
            onClick={handleAddToCart}
            disabled={addingToCart}
            style={{ opacity: addingToCart ? 0.7 : 1 }}
          >
            {addingToCart ? "Adding..." : "Add To Cart"}
          </button>

          <button
            className="buy-now"
            onClick={async () => {
              const token = localStorage.getItem("token");

              if (token) {
                const success = await handleAddToCart();
                if (success) {
                  navigate("/checkout");
                }
              } else {
                showNotification(
                  "Please login to proceed with purchase",
                  "error",
                );
                setTimeout(() => {
                  navigate("/login", {
                    state: {
                      redirectTo: "/checkout", 
                      pendingCartItem: {
                        productId: product.id,
                        quantity: quantity,
                      }, 
                    },
                  });
                }, 1500);
              }
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}
