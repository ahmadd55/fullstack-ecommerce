import { Category } from "../models/index.js";

export const createCategory = async ({ name, description, show_in_navbar }) => {
  const existingCategory = await Category.findOne({
    where: { name },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    description,
    show_in_navbar: show_in_navbar || false, 
  });

  return category;
};

export const getAllCategories = async (navbarOnly = false) => {
  const query = {
    order: [["created_at", "DESC"]],
  };

  if (navbarOnly) {
    query.where = { show_in_navbar: true };
  }

  return await Category.findAll(query);
};

export const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (id, { name, description, show_in_navbar }) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }
  }

  const updateData = { name, description };
  if (show_in_navbar !== undefined) {
    updateData.show_in_navbar = show_in_navbar;
  }

  await category.update(updateData);

  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.destroy();

  return category;
};