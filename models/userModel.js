import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },
    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please set password"],
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("appUsers", userSchema);
export default UserModel;
