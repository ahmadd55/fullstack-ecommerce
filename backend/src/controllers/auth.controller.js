import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { registerUser, loginUser, logoutUser, updateUserProfilePicture} from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadImageBuffer, isCloudinaryConfigured } from '../config/cloudinary.js';

export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const data = await registerUser({ firstName, lastName, email, phone, password, role });
    return res
        .status(201)
        .json(new ApiResponse(201, data, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    
    const { email, password, loginFrom } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    
    const data = await loginUser({ email, password, loginFrom });
    
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(400, "No token provided");
    }

    await logoutUser(token);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logout successful"));
});

export const addProfilePicture = asyncHandler(async(req, res)=>{
    const userId = req.params.id;
    if(!req.file) {
        throw new ApiError(400, "Please upload a profile picture");
    }
    if (!isCloudinaryConfigured()) {
        throw new ApiError(500, "Image storage is not configured. Set the CLOUDINARY_* environment variables.");
    }

    const uploaded = await uploadImageBuffer(req.file.buffer, "profile-pictures");
    const data = await updateUserProfilePicture(userId, uploaded.secure_url);
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Profile picture updated successfully"));
})