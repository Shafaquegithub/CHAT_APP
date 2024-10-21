import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    if (!password || !userId) {
      return res.status(400).json({
        message: "Please Enter Password",
        error: true,
      });
    }
    let user = await UserModel.findById(userId);
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Please check Password",
        error: true,
      });
    }

    const token = jwt.sign({ id: user?._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login Successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
