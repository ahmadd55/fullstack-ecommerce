import { getDashboardStatsService } from "../services/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const dashboardData = await getDashboardStatsService();

  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboardData, "Dashboard stats fetched successfully")
    );
});