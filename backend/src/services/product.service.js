import fs from "fs";
import csv from "csv-parser";

import {
  sequelize,
  Product,
  User,
  Category,
  SubCategory,
  ProductImage,
} from "../models/index.js";

import { ApiError } from "../utils/ApiError.js";


export const createProduct = async ({
  title,
  description,
  price,
  stock,
  userId,
  categoryId,
  subCategoryId,
}) => {
  
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

 
  const subCategory = await SubCategory.findByPk(subCategoryId);

  if (!subCategory) {
    throw new ApiError(404, "SubCategory not found");
  }

  if (subCategory.categoryId !== Number(categoryId)) {
    throw new ApiError(
      400,
      "SubCategory does not belong to this Category"
    );
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    userId,
    categoryId,
    subCategoryId,
  });

  return product;
};

export const getAllProducts = async (page = 1, limit = 30, categoryId = null) => {
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (categoryId) {
    whereCondition.categoryId = categoryId; 
  }

  const { count, rows: products } = await Product.findAndCountAll({
    where: whereCondition,
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true, 
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: SubCategory,
        as: "subCategory",
        attributes: ["id", "name"],
      },
      {
        model: ProductImage,
        as: "images",
        attributes: ["id", "image"],
      }
    ],
    order: [["created_at", "DESC"]],
  });

  return {
    products,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: SubCategory,
        as: "subCategory",
        attributes: ["id", "name"],
      },
      {
        model: ProductImage,
        as: "images",
        attributes: ["id", "image"],
      },
    ],
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const updateProduct = async (
  id,
  {
    title,
    description,
    price,
    stock,
    categoryId,
    subCategoryId,
  }
) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (categoryId !== undefined) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }

  if (subCategoryId !== undefined) {
    const subCategory = await SubCategory.findByPk(subCategoryId);

    if (!subCategory) {
      throw new ApiError(404, "SubCategory not found");
    }
  }

  
  const finalCategoryId =
    categoryId !== undefined
      ? categoryId
      : product.categoryId;

  const finalSubCategoryId =
    subCategoryId !== undefined
      ? subCategoryId
      : product.subCategoryId;

  
  if (
    finalCategoryId !== null &&
    finalSubCategoryId !== null
  ) {
    const subCategory = await SubCategory.findByPk(
      finalSubCategoryId
    );

    if (
      subCategory.categoryId !== Number(finalCategoryId)
    ) {
      throw new ApiError(
        400,
        "SubCategory does not belong to this Category"
      );
    }
  }

  await product.update({
    title: title !== undefined ? title : product.title,
    description:
      description !== undefined
        ? description
        : product.description,
    price: price !== undefined ? price : product.price,
    stock: stock !== undefined ? stock : product.stock,
    categoryId: finalCategoryId,
    subCategoryId: finalSubCategoryId,
  });

  return product;
};


export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.destroy();

  return product;
};


export const bulkUploadProductsService = async (filePath, adminId) => {
  const results = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  if (results.length === 0) {
    throw new ApiError(400, "CSV file is empty");
  }

  const transaction = await sequelize.transaction();

  try {
    let successCount = 0;

    for (const row of results) {
    
      const { title, price, desc, category, subcategory, stock } = row;

      if (!title || !price) continue; 

     
      let categoryId = null;
      let subCategoryId = null;

      if (category) {
        const catFound = await Category.findOne({ where: { name: category }, transaction });
        if (catFound) categoryId = catFound.id;
      }

      if (subcategory) {
        const subCatFound = await SubCategory.findOne({ where: { name: subcategory }, transaction });
        if (subCatFound) subCategoryId = subCatFound.id;
      }

      const newProduct = await Product.create(
        {
          title,
          description: desc,
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          userId: adminId, 
          categoryId,
          subCategoryId,
        },
        { transaction }
      );

      const imageRecords = [];
      
      for (const key in row) {
        if (key.startsWith("image") && row[key] && row[key].trim() !== "") {
          let imageUrl = row[key].trim();
          
          if (imageUrl.startsWith("//")) {
            imageUrl = "https:" + imageUrl;
          }

          imageRecords.push({
            productId: newProduct.id,
            image: imageUrl, 
          });
        }
      }

      if (imageRecords.length > 0) {
        await ProductImage.bulkCreate(imageRecords, { transaction });
      }

      successCount++;
    }

    await transaction.commit();
    return successCount;

  } catch (error) {
    await transaction.rollback();
    throw new ApiError(500, "Error importing products: " + error.message);
  } finally {
  
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};