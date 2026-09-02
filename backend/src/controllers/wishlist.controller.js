import { 
    addProductToWishlist, 
    getUserWishlistService, 
    removeProductFromWishlist 
} from "../services/wishlist.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const { wishlistItem, created } = await addProductToWishlist(userId, productId);

  if (!created) {
    return res.status(200).json(new ApiResponse(200, wishlistItem, "Product is already in your wishlist"));
  }

  return res.status(201).json(new ApiResponse(201, wishlistItem, "Product added to wishlist"));
});


export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const wishlist = await getUserWishlistService(userId);
  
  return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});


export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  await removeProductFromWishlist(userId, productId);

  return res.status(200).json(new ApiResponse(200, {}, "Removed from wishlist successfully"));
});