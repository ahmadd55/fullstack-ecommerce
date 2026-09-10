import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl";

export default function Card({ product, isWishlisted, onWishlistToggle }) {
  return (
    <Link to={`/detail/${product.id}`} className="cards group">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[14px] sm:rounded-[20px] bg-[#f5f5f5] shadow">
        <img
          src={resolveImageUrl(product.images?.[0])}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {onWishlistToggle && (
          <button
            type="button"
            onClick={(e) => onWishlistToggle(e, product.id)}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10 ${
              isWishlisted
                ? "text-red-500"
                : "text-gray-400 hover:text-red-500 hover:shadow-lg"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isWishlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        )}
      </div>

      <h4 className="text-sm sm:text-base line-clamp-2">{product.title}</h4>
      <p className="text-sm sm:text-base font-medium">Rs. {product.price}</p>
    </Link>
  );
}
