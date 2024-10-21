export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None",
      })
      .json({
        message: "Logout Successfully",
        logout: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
