import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Dotenv from "dotenv";
import mongoose from "mongoose";
import dbConnect from "./db/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
Dotenv.config();

app.use(bodyParser.json());
app.use(cors());

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import quizRoutes from "./routes/quiz.js";

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", questionRoutes);
app.use("/api", quizRoutes);

// Serve static files with an absolute path
app.use(express.static(path.resolve(__dirname, "./path_file/build")));

// Catch-all route
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./path_file/build", "index.html"));
});

mongoose.set("strictQuery", false);

dbConnect();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
