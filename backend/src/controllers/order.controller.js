import { checkoutCart, getUserOrdersService, getOrderByIdService, getAllOrdersAdminService, updateOrderStatusService} from "../services/order.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.user.id;

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  const order = await checkoutCart(userId, shippingAddress);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});


export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await getUserOrdersService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});


export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const order = await getOrderByIdService(userId, orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const data = await getAllOrdersAdminService();
  return res
    .status(200)
    .json(new ApiResponse(200, data, "All orders fetched successfully"));
});


export const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const updatedOrder = await updateOrderStatusService(orderId, status);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, `Order status updated to ${status} successfully`));
});