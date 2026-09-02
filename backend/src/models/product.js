import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Product = sequelizeInstance.define(
    "Product",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypesInstance.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
       
        type: DataTypesInstance.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypesInstance.INTEGER,
        allowNull: true,
      },
      subCategoryId: {
        type: DataTypesInstance.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "Products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["userId"] },
        { fields: ["categoryId"] },
        { fields: ["subCategoryId"] },
      ],
    }
  );

  Product.associate = (models) => {
    
    if (models.User) {
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        as: "seller",
        onDelete: "CASCADE",
      });
    }

    
    if (models.Category) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL",
      });
    }

    
    if (models.SubCategory) {
      Product.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        as: "subCategory",
        onDelete: "SET NULL",
      });
    }

    
    if (models.Wishlist) {
      Product.hasMany(models.Wishlist, {
        foreignKey: "productId",
        as: "wishlists",
      });
    }

    
    if (models.Cart) {
      Product.hasMany(models.Cart, {
        foreignKey: "productId",
        as: "cartItems",
      });
    }

    
    if (models.OrderItem) {
      Product.hasMany(models.OrderItem, {
        foreignKey: "productId",
        as: "orderItems",
      });
    }

    if (models.ProductImage){
      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
        as: "images",
        onDelete: "CASCADE",
    });
    }
    
  };

  return Product; 
};