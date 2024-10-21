import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getUserFromtoken = async (token) => {
  try {
    if (!token) {
      return {
        message: "session out",
        logout: true,
      };
    }

    const userID = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    let user;
    if (userID) {
      user = await userModel.findById(userID.id);
    }
    return user;
  } catch (error) {
    return {
      error: error,
      message: "Your token has Expired, please re-login",
    };
  }
};
export default getUserFromtoken;
