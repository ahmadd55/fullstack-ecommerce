import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/Card";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchResults = async (page = 1) => {
    if (!query) {
      setProducts([]);
      setTotalItems(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `/products?search=${encodeURIComponent(query)}&page=${page}&limit=30`
      );

      const data = response.data.data;
      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.log("Error searching products:", error);
      setProducts([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(1);
    window.scrollTo({ top: 0 });
  }, [query]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchResults(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pt-28 pb-8">
      <div className="mb-6 sm:mb-8 pb-4 px-3 sm:px-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {query ? `Results for "${query}"` : "Search"}
        </h2>

        {!loading && query && totalItems > 0 && (
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            {totalItems} {totalItems === 1 ? "product" : "products"} found
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl font-semibold">Loading...</div>
      ) : !query ? (
        <div className="text-center py-20 text-gray-500 text-lg px-4">
          Type something in the search bar to find products.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-gray-500 text-lg">
            We couldn&apos;t find anything matching &quot;{query}&quot;.
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            Try a shorter or more general word.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2 rounded font-semibold text-sm sm:text-base bg-black text-white hover:bg-gray-800"
          >
            Back to home
          </Link>
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
