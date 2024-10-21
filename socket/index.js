import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import getUserFromtoken from "../controller/getDeatilsFromToken.js";
import UserModel from "../models/userModel.js";
import conversationModel, {
  messageModel,
} from "../models/conversationModel.js";
import { getChatInfo } from "../helper/getChatInfo.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://shz-chat-app.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUser = new Set();
io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;
  const user = await getUserFromtoken(token);
  socket.join(user?.id?.toString());
  onlineUser.add(user?.id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-receiver", async (data) => {
    const receiver = await UserModel.findById(data).select("-password");
    const payload = {
      id: receiver?._id,
      name: receiver?.name,
      email: receiver?.email,
      profile_pic: receiver?.profile_pic,
      isOnline: onlineUser.has(data?.toString()),
    };
    socket.emit("receiver-details", payload);
  });

  socket.on("checkPrevMsg", async (userId) => {
    let getConversation = await conversationModel
      .findOne({
        $or: [
          {
            sender: user?.id,
            receiver: userId,
          },
          {
            sender: userId,
            receiver: user?.id,
          },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("getPrevConv", getConversation);
  });
  socket.on("new message", async (data) => {
    let conversation = await conversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    if (!conversation) {
      const createConversation = await conversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }
    const message = new messageModel({
      text: data?.text,
      image_url: data?.image,
      video_url: data?.video,
      messageSendBy: data?.sender,
    });
    const savedMessage = await message.save();
    const updatedConversation = await conversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: savedMessage?._id },
      }
    );

    const getConversation = await conversationModel
      .findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { receiver: data?.sender, sender: data?.receiver },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("messaging", getConversation);
    io.to(data?.receiver).emit("messaging", getConversation);
    const senderChatInfo = await getChatInfo(data?.sender);
    const receiverChatInfo = await getChatInfo(data?.receiver);
    io.to(data?.sender).emit("chatInfo", senderChatInfo);
    io.to(data?.receiver).emit("chatInfo", receiverChatInfo);
  });
  socket.on("sidebar", async (userId) => {
    const chatInfo = await getChatInfo(userId);
    socket.emit("chatInfo", chatInfo);
  });
  socket.on("seen", async (opponent) => {
    const conversation = await conversationModel.findOne({
      $or: [
        { sender: user?.id, receiver: opponent },
        { sender: opponent, receiver: user?.id },
      ],
    });
    const conversationMessagesId = conversation?.messages || [];
    const updatedConversation = await messageModel.updateMany(
      {
        _id: { $in: conversationMessagesId },
        messageSendBy: opponent,
      },
      { $set: { seen: true } }
    );
    const SenderConvAfterSeen = await getChatInfo(user?.id);
    const ReceiverConvAfterSeen = await getChatInfo(opponent);
    io.to(user?.id).emit("chatInfo", SenderConvAfterSeen);
    io.to(opponent).emit("chatInfo", ReceiverConvAfterSeen);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?.id);
  });
});
export { app, server };
