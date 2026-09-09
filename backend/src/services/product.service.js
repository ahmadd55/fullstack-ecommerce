import fs from "fs";
import csv from "csv-parser";
import { Op } from "sequelize";

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

const MAX_SEARCH_TERMS = 6;

// `%` and `_` are ILIKE wildcards, so a user typing them must not widen the match.
const escapeLike = (value) => value.replace(/[\\%_]/g, "\\$&");

const toTerms = (search) =>
  String(search).trim().split(/\s+/).filter(Boolean).slice(0, MAX_SEARCH_TERMS);

// Every term must match somewhere, but each one may match a different field, so
// "men shirt" still finds a shirt that only knows it is a men's product via its category.
const buildSearchCondition = async (terms) => {
  const perTerm = await Promise.all(
    terms.map(async (term) => {
      const pattern = `%${escapeLike(term)}%`;

      const [categories, subCategories] = await Promise.all([
        Category.findAll({
          where: { name: { [Op.iLike]: pattern } },
          attributes: ["id"],
          raw: true,
        }),
        SubCategory.findAll({
          where: { name: { [Op.iLike]: pattern } },
          attributes: ["id"],
          raw: true,
        }),
      ]);

      const matchers = [
        { title: { [Op.iLike]: pattern } },
        { description: { [Op.iLike]: pattern } },
      ];

      if (categories.length > 0) {
        matchers.push({ categoryId: { [Op.in]: categories.map((row) => row.id) } });
      }

      if (subCategories.length > 0) {
        matchers.push({
          subCategoryId: { [Op.in]: subCategories.map((row) => row.id) },
        });
      }

      return { [Op.or]: matchers };
    })
  );

  return { [Op.and]: perTerm };
};

// A title hit means far more than a passing mention in the marketing copy.
const buildRelevanceOrder = (search, terms) => {
  const wholePhrase = sequelize.escape(`%${escapeLike(String(search).trim())}%`);

  const anyTerm = terms
    .map(
      (term) =>
        `"Product"."title" ILIKE ${sequelize.escape(`%${escapeLike(term)}%`)}`
    )
    .join(" OR ");

  return [
    sequelize.literal(
      `CASE WHEN "Product"."title" ILIKE ${wholePhrase} THEN 0 WHEN ${anyTerm} THEN 1 ELSE 2 END ASC`
    ),
  ];
};

export const getAllProducts = async (
  page = 1,
  limit = 30,
  categoryId = null,
  search = null
) => {
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (categoryId) {
    whereCondition.categoryId = categoryId; 
  }

  let order = [["created_at", "DESC"]];

  const terms = search ? toTerms(search) : [];

  if (terms.length > 0) {
    const searchCondition = await buildSearchCondition(terms);
    whereCondition[Op.and] = searchCondition[Op.and];
    order = [...buildRelevanceOrder(search, terms), ...order];
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
    order,
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