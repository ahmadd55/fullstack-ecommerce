import {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
} from "../services/productImage.service.js";
import {
  uploadImageBuffer,
  isCloudinaryConfigured,
} from "../config/cloudinary.js";


export const createProductImageController = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          "Image storage is not configured. Set the CLOUDINARY_* environment variables.",
      });
    }

    const uploaded = await uploadImageBuffer(req.file.buffer, "products");

    const productImage = await createProductImage({
      productId,
      image: uploaded.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Product image uploaded successfully",
      data: productImage,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductImagesController = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await getProductImages(productId);

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductImageByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const productImage = await getProductImageById(id);

    return res.status(200).json({
      success: true,
      data: productImage,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProductImageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    const productImage = await updateProductImage(id, {
      image,
    });

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      data: productImage,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteProductImageController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteProductImage(id);

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};