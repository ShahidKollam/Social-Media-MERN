import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoute from "./routes/messageRoute.js"
import { v2 as cloudinary } from "cloudinary";
import { server, app } from "./socket/socket.js";
import job from "./cron/cron.js";

dotenv.config();
connectDB();
job.start()

const PORT = process.env.PORT || 4000; 
const __dirname = path.resolve()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoute);

// http://localhost:5000 => backend, frontend

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")))
}

app.get("*", (req,res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})


server.listen(PORT, () => console.log(`Server started @ http://localhost:${PORT}`));
