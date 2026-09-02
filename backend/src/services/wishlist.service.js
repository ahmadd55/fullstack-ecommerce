import { Wishlist, Product, ProductImage } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export const addProductToWishlist = async (userId, productId) => {
  const productExists = await Product.findByPk(productId);
  if (!productExists) {
    throw new ApiError(404, "Product not found");
  }

  const [wishlistItem, created] = await Wishlist.findOrCreate({
    where: { userId, productId },
  });

  return { wishlistItem, created };
};


export const getUserWishlistService = async (userId) => {
  const wishlist = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["image"]
          }
        ]
      },
    ],
  });
  return wishlist;
};

export const removeProductFromWishlist = async (userId, productId) => {
  const deleted = await Wishlist.destroy({
    where: { userId, productId },
  });

  if (!deleted) {
    throw new ApiError(404, "Item not found in wishlist");
  }

  return true;
};