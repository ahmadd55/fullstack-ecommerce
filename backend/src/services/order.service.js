import { sequelize, Order, OrderItem, Cart, Product, ProductImage } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";


export const checkoutCart = async (userId, shippingAddress) => {
  
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });

  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  let totalAmount = 0;
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Not enough stock for ${item.product.title}. Available: ${item.product.stock}`
      );
    }
    totalAmount += parseFloat(item.product.price) * item.quantity;
  }

  
  const transaction = await sequelize.transaction();

  try {
  
    const order = await Order.create(
      {
        userId,
        totalAmount,
        shippingAddress,
        status: "pending",
      },
      { transaction }
    );

   
    const orderItemsData = [];
    
    for (const item of cartItems) {
     
      orderItemsData.push({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
      });

     
      await Product.decrement(
        "stock",
        { by: item.quantity, where: { id: item.productId }, transaction }
      );
    }


    await OrderItem.bulkCreate(orderItemsData, { transaction });
    
    await Cart.destroy({
      where: { userId },
      transaction,
    });

    
    await transaction.commit();

    return order;
  } catch (error) {
    
    await transaction.rollback();
    throw error;
  }
};


export const getUserOrdersService = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    order: [["created_at", "DESC"]],
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price"],
            include: [{ model: ProductImage, as: "images", attributes: ["image"] }],
          },
        ],
      },
    ],
  });

  return orders;
};


export const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price"],
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};


export const getAllOrdersAdminService = async () => {
  const orders = await Order.findAll({
    order: [["created_at", "DESC"]],
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price"],
          },
        ],
      },
    ],
  });
  return orders;
};

export const updateOrderStatusService = async (orderId, newStatus) => {
  const order = await Order.findByPk(orderId);
  
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = newStatus;
  await order.save();

  return order;
};