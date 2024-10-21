import conversationModel from "../models/conversationModel.js";

export const getChatInfo = async (userId) => {
  if (userId) {
    const chatList = await conversationModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .populate("messages")
      .populate("sender")
      .populate("receiver")
      .sort({ updatedAt: -1 });
    const chatInfo = chatList.map((chat) => {
      const unSeenMsg = chat?.messages.reduce((prev, curr) => {
        return prev + (curr?.seen || curr.messageSendBy == userId ? 0 : 1);
      }, 0);
      return {
        chatId: chat?._id,
        sender: chat?.sender,
        receiver: chat?.receiver,
        unSeenMsgCount: unSeenMsg,
        lastMsg: chat?.messages[chat?.messages?.length - 1],
      };
    });
    return chatInfo;
  } else {
    return [];
  }
};
