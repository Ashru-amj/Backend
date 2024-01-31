import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/authMiddleware.js";
import  {
  CreateQuiz,
  shareQuizLink,
  ImpressionCount,
  checkAnswer,
  deleteQuizId,
  updateQuizId,
  quizRead,
  getQuiz,
  AddQuestion,
}  from "../controller/quizController.js";

// Create a new quiz
router.post("/quizzes", authenticateUser, CreateQuiz);
router.get("/quizzes", authenticateUser, getQuiz);

// Share a quiz by generating a unique link or code
router.get("/quizzes/:quizId/share", shareQuizLink);

// Track impressions for a quiz
router.get("/quizzes/:quizId", ImpressionCount);

router.get("/quizzes/read/:quizId", quizRead);

// checking for answers
router.post("/quizzes/check-answer", checkAnswer);

router.delete("/quizzes/:quizId", authenticateUser, deleteQuizId);

// PUT /quizzes/:quizId
router.put("/quizzes/:quizId", authenticateUser, updateQuizId);
// Add new Question to quiz
router.get("/stats", authenticateUser, AddQuestion);

// Implement other quiz-related routes as needed
// ...

export default  router;
