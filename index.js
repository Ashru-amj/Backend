import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Dotenv from "dotenv";
import dbConnect from "./db/db.js";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath function

const __filename = fileURLToPath(import.meta.url); // Get the current module's file path
const __dirname = path.dirname(__filename); // Derive the directory path

const app = express();
Dotenv.config();

app.use(bodyParser.json());

app.use(cors());

// Routes

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import quizRoutes from "./routes/quiz.js";

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", questionRoutes);
app.use("/api", quizRoutes);

app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});
mongoose.set("strictQuery", false);

dbConnect();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
