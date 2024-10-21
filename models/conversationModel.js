import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "",
    },
    video_url: {
      type: String,
      default: "",
    },
    messageSendBy: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const messageModel = mongoose.model("messages", messageSchema);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "appUsers",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "appUsers",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "messages",
      },
    ],
  }, 
  {
    timestamps: true,
  }
);
const conversationModel = mongoose.model("conversations", conversationSchema);
export default conversationModel;
