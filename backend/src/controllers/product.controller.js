import { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct, bulkUploadProductsService } from "../services/product.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProductController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      categoryId,
      subCategoryId,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    const product = await createProduct({
      title,
      description,
      price,
      stock,
      categoryId,
      subCategoryId,

      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 30, category, search, q } = req.query;
    const products = await getAllProducts(page, limit, category, search ?? q);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      stock,
      categoryId,
      subCategoryId,
    } = req.body;

    const product = await updateProduct(id, {
      title,
      description,
      price,
      stock,
      categoryId,
      subCategoryId,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bulkUploadProducts = asyncHandler(async (req, res) => {
 
  if (!req.file) {
    throw new ApiError(400, "Please upload a CSV file");
  }

  const adminId = req.user.id;

  const successCount = await bulkUploadProductsService(req.file.buffer, adminId);

  return res
    .status(201)
    .json(new ApiResponse(201, { importedProducts: successCount }, `Successfully imported ${successCount} products`));
});