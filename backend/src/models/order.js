import { DataTypes } from "sequelize";

export const OrderFactory = (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Order = sequelizeInstance.define(
    "Order",
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
      status: {
        type: DataTypesInstance.ENUM(
          "pending",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      totalAmount: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      shippingAddress: {
        type: DataTypesInstance.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["userId"] },
        { fields: ["status"] },
      ],
    }
  );

  Order.associate = (models) => {
    if (models.User) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "customer",
        onDelete: "CASCADE",
      });
    }

    if (models.OrderItem) {
      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
        onDelete: "CASCADE",
      });
    }
  };

  return Order;
};


export const OrderItemFactory = (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const OrderItem = sequelizeInstance.define(
    "OrderItem",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
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
      unitPrice: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "OrderItems",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["orderId"] },
        { fields: ["productId"] },
      ],
    }
  );

  OrderItem.associate = (models) => {
    if (models.Order) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
      });
    }

    if (models.Product) {
      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "RESTRICT", 
      });
    }
  };

  return OrderItem;
};