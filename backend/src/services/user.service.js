import { User, Order } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export const getCustomersForAdmin = async () => {
 
  const users = await User.findAll({
    where: { role: "user" },
    attributes: ["id", "firstName", "lastName", "email", "created_at"], 
    include: [
      {
        model: Order,
        as: "orders",
        attributes: ["id", "totalAmount", "status"], 
      },
    ],
    order: [["created_at", "DESC"]], 
  });

  
  const customersWithStats = users.map((user) => {
   
    const userData = user.toJSON();

    const validOrders = userData.orders.filter(
      (order) => order.status !== "cancelled"
    );

    const totalOrders = validOrders.length;
    
    const lifetimeValue = validOrders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount),
      0
    );

    delete userData.orders;

    return {
      ...userData,
      totalOrders,
      lifetimeValue,
    };
  });

  return customersWithStats;
};

export const updateCustomerByAdmin = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "You cannot edit another admin's details");
  }

  user.firstName = updateData.firstName || user.firstName;
  user.lastName = updateData.lastName || user.lastName;
  user.phone = updateData.phone || user.phone;
 
  if (updateData.email) {
    user.email = updateData.email;
  }

  await user.save();

  const updatedUser = user.get({ plain: true });
  delete updatedUser.password; 

  return updatedUser;
};

export const deleteCustomerByAdmin = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "You cannot delete an admin account");
  }

  await user.destroy();
  return true;
};