import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
});

const User = mongoose.model("User", userSchema);
export default User;
