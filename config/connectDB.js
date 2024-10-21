import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "chat_app" });
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("connected with Chat-App");
    });
    connection.on("error", () => {
      console.log("Error with Chat-App");
    });
  } catch (error) {
    console.log("mongoose error", error);
  }
}
