import {
  ProductImage,
  Product,
} from "../models/index.js";

import { ApiError } from "../utils/ApiError.js";


export const createProductImage = async ({
  productId,
  image,
}) => {
  
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!image) {
    throw new ApiError(400, "Image is required");
  }

  const productImage = await ProductImage.create({
    productId,
    image,
  });

  return productImage;
};


export const getProductImages = async (productId) => {
  
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const images = await ProductImage.findAll({
    where: {
      productId,
    },
    order: [["created_at", "ASC"]],
  });

  return images;
};


export const getProductImageById = async (id) => {
  const productImage = await ProductImage.findByPk(id);

  if (!productImage) {
    throw new ApiError(404, "Product image not found");
  }

  return productImage;
};


export const updateProductImage = async (
  id,
  { image }
) => {
  const productImage = await ProductImage.findByPk(id);

  if (!productImage) {
    throw new ApiError(404, "Product image not found");
  }

  if (!image) {
    throw new ApiError(400, "Image is required");
  }

  await productImage.update({
    image,
  });

  return productImage;
};


export const deleteProductImage = async (id) => {
  const productImage = await ProductImage.findByPk(id);

  if (!productImage) {
    throw new ApiError(404, "Product image not found");
  }

  await productImage.destroy();

  return productImage;
};