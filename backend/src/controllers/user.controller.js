import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCustomersForAdmin, updateCustomerByAdmin, deleteCustomerByAdmin } from "../services/user.service.js";


export const getProfile = asyncHandler(async (req, res) => {
  
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"));
});


export const getAdminCustomersList = asyncHandler(async (req, res) => {
  const customers = await getCustomersForAdmin();
  
  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers list with stats fetched successfully"));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const userId = req.params.id; 
  
  const updatedUser = await updateCustomerByAdmin(userId, req.body);
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Customer details updated successfully"));
});


export const deleteCustomer = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  await deleteCustomerByAdmin(userId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Customer deleted successfully"));
});