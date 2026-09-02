import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../services/subcategory.service.js";


export const createSubCategoryController = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Name and categoryId are required",
      });
    }

    const subCategory = await createSubCategory({
      name,
      categoryId,
    });

    return res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: subCategory,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllSubCategoriesController = async (req, res) => {
  try {
    const subCategories = await getAllSubCategories();

    return res.status(200).json({
      success: true,
      data: subCategories,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSubCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await getSubCategoryById(id);

    return res.status(200).json({
      success: true,
      data: subCategory,
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subCategory = await updateSubCategory(id, {
      name,
      categoryId,
    });

    return res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      data: subCategory,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteSubCategory(id);

    return res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};