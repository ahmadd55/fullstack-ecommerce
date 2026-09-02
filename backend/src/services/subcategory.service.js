import { SubCategory, Category } from "../models/index.js";

export const createSubCategory = async ({
  name,
  categoryId,
}) => {
  
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const existingSubCategory = await SubCategory.findOne({
    where: {
      name,
      categoryId,
    },
  });

  if (existingSubCategory) {
    throw new Error(
      "SubCategory already exists in this category"
    );
  }

  const subCategory = await SubCategory.create({
    name,
    categoryId,
  });

  return subCategory;
};


export const getAllSubCategories = async () => {
  return await SubCategory.findAll({
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};


export const getSubCategoryById = async (id) => {
  const subCategory = await SubCategory.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  return subCategory;
};


export const updateSubCategory = async (
  id,
  { name, categoryId }
) => {
  const subCategory = await SubCategory.findByPk(id);

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  if (
    categoryId !== undefined &&
    categoryId !== subCategory.categoryId
  ) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const newCategoryId =
    categoryId ?? subCategory.categoryId;

  const newName = name ?? subCategory.name;

  const existingSubCategory = await SubCategory.findOne({
    where: {
      name: newName,
      categoryId: newCategoryId,
    },
  });

  if (
    existingSubCategory &&
    existingSubCategory.id !== subCategory.id
  ) {
    throw new Error(
      "SubCategory already exists in this category"
    );
  }

  await subCategory.update({
    name: newName,
    categoryId: newCategoryId,
  });

  return subCategory;
};


export const deleteSubCategory = async (id) => {
  const subCategory = await SubCategory.findByPk(id);

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  await subCategory.destroy();

  return subCategory;
};