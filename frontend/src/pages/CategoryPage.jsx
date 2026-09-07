import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/Card";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategoryProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/products?category=${id}&page=${page}&limit=30`,
      );

      const data = response.data.data;
      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);

      if (data.products.length > 0) {
        setCategoryName(data.products[0].category?.name || "Category");
      }
    } catch (error) {
      console.log("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts(1);
  }, [id]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchCategoryProducts(pageNumber);
    }
  };

  if (loading)
    return (
      <div className="text-center pt-32 pb-20 text-xl font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="max-w-[1440px] mx-auto pt-28 pb-8">
      <div className="mb-6 sm:mb-8 pb-4 px-3 sm:px-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {categoryName || "Products"}
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg px-4">
          No products found in this category.
        </div>
      ) : (
        <>
          <div className="cards-container">
            {products.map((item) => (
              <Card key={item.id} product={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 sm:gap-4 mt-12 mb-10 px-4">
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
      )}
    </div>
  );
}
