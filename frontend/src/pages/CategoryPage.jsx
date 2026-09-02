import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

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
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <div className="mb-8 pb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {categoryName || "Products"}
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No products found in this category.
        </div>
      ) : (
        <>
          <div className="cards-container flex flex-wrap justify-center gap-30">
            {products.map((item) => (
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
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-10">
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
      )}
    </div>
  );
}
