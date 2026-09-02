import { useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import api from "../api/axios";

export default function Home() {
  const { products, loading, currentPage, totalPages, goToPage } = useProducts();
  const [wishlistedItems, setWishlistedItems] = useState([]);

 
  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = wishlistedItems.includes(productId);

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
        setWishlistedItems((prev) => prev.filter((id) => id !== productId));
      } else {
        await api.post("/wishlist", { productId });

        setWishlistedItems((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.log("Error updating wishlist", error);
      alert("Please login to manage wishlist");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Slider />

      <div className="cards-container">
        {products.map((item) => {
          const isWishlisted = wishlistedItems.includes(item.id);

          return (
            <Link
              to={`/detail/${item.id}`}
              key={item.id}
              className="cards relative group"
            >
              <img
                src={
                  item.images?.[0]?.image
                    ? item.images[0].image.startsWith("http")
                      ? item.images[0].image 
                      : `http://localhost:3000${item.images[0].image}` 
                    : "/placeholder.png" 
                }
                alt={item.title}
              />

              <h4>{item.title}</h4>
              <p>Rs. {item.price}</p>

              <button
                onClick={(e) => handleWishlistToggle(e, item.id)}
                className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10 
                  ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500 hover:shadow-lg"}
                `}
                title={
                  isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isWishlisted ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            </Link>
          );
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10 mb-10">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded font-semibold ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Previous
          </button>

          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 rounded font-semibold ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
