import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const updateUserDetails = async (req, res) => {
  const myToken = req.cookies.token;
  const { name, profile_pic } = req.body;
  try {
    if (!name && !profile_pic) {
      return res.status(400).json({
        message: "Provide some values",
        error: true,
      });
    }
    if (!myToken) {
      return res.status(400).json({
        message: "Token not available",
        error: true,
      });
    }
    const user = jwt.verify(req.cookies.token, process.env.JWT_PRIVATE_KEY);
    const updateUser = await UserModel.findByIdAndUpdate(
      { _id: user.id },
      {
        name,
        profile_pic,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    return res.status(200).json({
      message: "User updated successfully",
      user: updateUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
