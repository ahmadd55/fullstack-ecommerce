import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Cart = sequelizeInstance.define(
    "Cart",
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
      quantity: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "Carts",
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

  Cart.associate = (models) => {
    if (models.User) {
      Cart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }

    if (models.Product) {
      Cart.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
      });
    }
  };

  return Cart; 
};