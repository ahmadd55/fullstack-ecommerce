import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Wishlist = sequelizeInstance.define(
    "Wishlist",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Wishlists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["userId"] },
        { fields: ["productId"] },
        {
          unique: true,
          fields: ["userId", "productId"],
        },
      ],
    }
  );

  Wishlist.associate = (models) => {
    if (models.User) {
      Wishlist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }

    if (models.Product) {
      Wishlist.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
      });
    }
  };

  return Wishlist;
};