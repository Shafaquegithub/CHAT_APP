import UserModel from "../models/userModel.js";

export const searchUser = async (req, res) => {
  const { search } = req.body;
  try {
    const query = new RegExp(search, "i", "g");
    const resp = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");
    return res.status(200).json({
      users: resp,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || error, error: true });
  }
};
