import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;
    if (!name || !email || !password || !profile_pic) {
      return res.status(400).json({
        message: "Please full form",
        error: true,
      });
    }
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        message: "This email is already in use",
        error: true,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      profile_pic,
    });
    const saveUser = await newUser.save();
    let userData = saveUser.toObject();
    delete userData.password;
    return res.status(200).json({
      message: "user added Successfully",
      user: userData,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || error,
      error: true,
    });
  }
};
export default registerUser;
