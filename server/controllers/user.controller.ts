import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import User from "../models/user.model";

const createOrUpdateUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email || !name.trim() || !email.trim()) {
        throw new ApiError(400, 'Name and email are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        const newUser = await User.create({ name, email });
        res.status(201)
            .json(new ApiResponse(201, 'User created successfully', newUser));
    }

    res.status(200)
        .json(new ApiResponse(200, 'User updated successfully', user));
});


export const userController = {
    createOrUpdateUser,
};