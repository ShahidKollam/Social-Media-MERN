import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDb.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.listen(PORT, () =>
  console.log(`Server started @ http://localhost:${PORT} `)
);
