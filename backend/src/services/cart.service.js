import { Cart, Product, ProductImage } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";


export const addItemToCart = async (userId, productId, quantity = 1) => {
  
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  
  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  const existingCartItem = await Cart.findOne({
    where: { userId, productId },
  });

  if (existingCartItem) {
    
    const newQuantity = existingCartItem.quantity + quantity;
    
    if (product.stock < newQuantity) {
        throw new ApiError(400, "Cannot add more. Not enough stock available.");
    }
    
    existingCartItem.quantity = newQuantity;
    await existingCartItem.save();
    return existingCartItem;
  }

 
  const newCartItem = await Cart.create({
    userId,
    productId,
    quantity,
  });

  return newCartItem;
};


export const getUserCart = async (userId) => {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "stock"], 
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["image"], 
          },
        ],
      },
    ],
  });

  
  let cartTotal = 0;
  cartItems.forEach((item) => {
    cartTotal += parseFloat(item.product.price) * item.quantity;
  });

  return { cartItems, cartTotal };
};


export const updateCartItemQuantity = async (userId, cartId, quantity) => {
  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cartItem = await Cart.findOne({
    where: { id: cartId, userId }, 
    include: [{ model: Product, as: "product" }],
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (cartItem.product.stock < quantity) {
    throw new ApiError(400, "Requested quantity exceeds available stock");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
};


export const removeCartItem = async (userId, cartId) => {
  const deletedCount = await Cart.destroy({
    where: { id: cartId, userId },
  });

  if (deletedCount === 0) {
    throw new ApiError(404, "Cart item not found");
  }

  return true;
};