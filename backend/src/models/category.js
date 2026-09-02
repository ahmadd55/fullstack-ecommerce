import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Category = sequelizeInstance.define(
    "Category",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypesInstance.TEXT,
        allowNull: true,
      },
      show_in_navbar: {
        type: DataTypesInstance.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Category.associate = (models) => {
    if (models.SubCategory) {
      Category.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subCategories",
        onDelete: "CASCADE",
      });
    }

    if (models.Product) {
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
        onDelete: "SET NULL",
      });
    }
  };

  return Category; 
};