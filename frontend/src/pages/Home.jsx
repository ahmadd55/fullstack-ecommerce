import { useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import Slider from "../components/Slider";
import Card from "../components/Card";
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

  if (loading) return <p className="pt-28 px-5">Loading...</p>;

  return (
    <>
      <Slider />

      <div className="cards-container">
        {products.map((item) => (
          <Card
            key={item.id}
            product={item}
            isWishlisted={wishlistedItems.includes(item.id)}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-10 mb-10 px-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 sm:px-6 py-2 rounded font-semibold text-sm sm:text-base ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Previous
          </button>

          <span className="font-medium text-gray-700 text-sm sm:text-base text-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-6 py-2 rounded font-semibold text-sm sm:text-base ${
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
