import { Order, OrderItem, User, Product, Category, Sequelize } from "../models/index.js";
const { Op } = Sequelize;

export const getDashboardStatsService = async () => {
 
  const totalOrdersCount = await Order.count({ where: { status: { [Op.ne]: "cancelled" } } });
  const totalRevenueSum = await Order.sum("totalAmount", { where: { status: { [Op.ne]: "cancelled" } } });
  const totalCustomersCount = await User.count({ where: { role: "user" } });

  const monthlyData = {};
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString("en-US", { month: "short" });
    monthlyData[monthName] = 0; 
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); 

  const recentOrdersForChart = await Order.findAll({
    where: {
      status: { [Op.ne]: "cancelled" },
      created_at: { [Op.gte]: sixMonthsAgo },
    },
    attributes: ["totalAmount", "created_at"],
  });

  recentOrdersForChart.forEach((order) => {
    const month = new Date(order.created_at).toLocaleString("en-US", { month: "short" });
    if (monthlyData[month] !== undefined) {
      monthlyData[month] += parseFloat(order.totalAmount);
    }
  });

  const salesOverview = Object.keys(monthlyData).map((month) => ({
    name: month,
    total: monthlyData[month],
  }));


  const orderItems = await OrderItem.findAll({
    include: [
      {
        model: Order,
        as: "order",
        where: { status: { [Op.ne]: "cancelled" } },
        attributes: [],
      },
      {
        model: Product,
        as: "product",
        attributes: ["categoryId"],
        include: [{ model: Category, as: "category", attributes: ["name"] }], 
      },
    ],
  });

  const categoryData = {};
  let totalCategorySales = 0;

  orderItems.forEach((item) => {
    const catName = item.product?.category?.name || "Other";
    const itemTotal = parseFloat(item.unitPrice) * item.quantity;
    categoryData[catName] = (categoryData[catName] || 0) + itemTotal;
    totalCategorySales += itemTotal;
  });

  const salesByCategory = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
    percentage: totalCategorySales > 0 ? Math.round((categoryData[key] / totalCategorySales) * 100) : 0,
  })).sort((a, b) => b.value - a.value); 

  const recentOrders = await Order.findAll({
    limit: 5,
    order: [["created_at", "DESC"]],
    include: [{ model: User, as: "customer", attributes: ["firstName", "lastName"] }],
  });

  const lowStockProducts = await Product.findAll({
    where: { stock: { [Op.lt]: 10 } },
    limit: 5,
    attributes: ["id", "title", "stock"],
  });

  const recentUsers = await User.findAll({
    where: { role: "user" },
    limit: 5,
    order: [["created_at", "DESC"]],
    attributes: ["firstName", "lastName", "created_at"],
  });

  return {
    stats: {
      revenue: `Rs ${parseFloat(totalRevenueSum || 0).toLocaleString()}`,
      orders: totalOrdersCount.toLocaleString(),
      customers: totalCustomersCount.toLocaleString(),
    },
    charts: {
      salesOverview,
      salesByCategory,
    },
    activities: { recentOrders, lowStockProducts, recentUsers },
  };
};