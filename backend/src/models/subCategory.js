import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const SubCategory = sequelizeInstance.define(
    "SubCategory",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "SubCategories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ fields: ["categoryId"] }],
    }
  );

  SubCategory.associate = (models) => {
    if (models.Category) {
      SubCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "CASCADE",
      });
    }

    if (models.Product) {
      SubCategory.hasMany(models.Product, {
        foreignKey: "subCategoryId",
        as: "products",
        onDelete: "SET NULL",
      });
    }
  };

  return SubCategory; 
};