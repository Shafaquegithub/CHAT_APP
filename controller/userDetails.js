import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const userDetails = async (req, res) => {
  const myToken = req.cookies.token;

  try {
    if (!myToken) {
      return res.json({
        message: "Token not available",
        logout: true,
      });
    }
    const verifyToken = jwt.verify(
      req.cookies.token,
      process.env.JWT_PRIVATE_KEY
    );

    if (verifyToken) {
      req.user = await UserModel.findById(verifyToken.id).select("-password");
    }
    return res.status(200).json({
      message: "User details got successfully",
      user: req.user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
