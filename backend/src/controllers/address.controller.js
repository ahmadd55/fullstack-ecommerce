import { Address } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const addAddress = asyncHandler(async (req, res) => {
  const { title, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

  if (!addressLine1 || !city || !state || !postalCode) {
    throw new ApiError(400, "Please provide all required address fields");
  }

  const address = await Address.create({
    userId: req.user.id, 
    title,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  });

  return res.status(201).json(new ApiResponse(201, address, "Address added successfully"));
});


export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.id },
  });

  return res.status(200).json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const updates = req.body;

  const address = await Address.findOne({
    where: { id: addressId, userId: req.user.id },
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  await address.update(updates);

  return res.status(200).json(new ApiResponse(200, address, "Address updated successfully"));
});


export const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const address = await Address.findOne({
    where: { id: addressId, userId: req.user.id },
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  await address.destroy();

  return res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully"));
});