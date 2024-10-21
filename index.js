import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import { config } from "dotenv";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/index.js";
// const app = express();
config({ path: ".env" });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/app/v1/user", userRouter);

const port = process.env.PORT || 3333;
connectDB().then(() => {
  server.listen(port, () => {
    console.log("running at" + port);
  });
});
