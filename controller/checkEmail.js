import UserModel from "../models/userModel.js";

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please Enter Email",
        error: true,
      });
    }
    const verifyEmail = await UserModel.findOne({ email }).select("-password");
    if (!verifyEmail) {
      return res.status(400).json({
        message: "User with this email not found",
        error: true,
      });
    }
    return res.status(200).json({
      message: "User available",
      user: verifyEmail,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
