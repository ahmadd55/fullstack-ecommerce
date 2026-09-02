import {
  addItemToCart,
  getUserCart,
  updateCartItemQuantity,
  removeCartItem,
} from "../services/cart.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; 

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const cartItem = await addItemToCart(userId, productId, quantity || 1);

  return res
    .status(201)
    .json(new ApiResponse(201, cartItem, "Item added to cart successfully"));
});


export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartData = await getUserCart(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cartData, "Cart fetched successfully"));
});


export const updateCartItem = asyncHandler(async (req, res) => {
  const cartId = req.params.id; 
  const { quantity } = req.body;
  const userId = req.user.id;

  if (quantity === undefined) {
    throw new ApiError(400, "Quantity is required");
  }

  const updatedCartItem = await updateCartItemQuantity(userId, cartId, quantity);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCartItem, "Cart updated successfully"));
});


export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartId = req.params.id;
  const userId = req.user.id;

  await removeCartItem(userId, cartId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item removed from cart"));
});