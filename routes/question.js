import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/authMiddleware.js";
import {
  postQuestions,
  putQuestions,
  getQuestion,
  evaluateQuestionsId,
  editQuestionsId,
} from "../controller/questionsController.js";

router.post("/questions", authenticateUser, postQuestions);

router.put("/questions", authenticateUser, putQuestions);

router.get("/questions/:quizId", getQuestion);
// Evaluate answer
router.post("/questions/:questionId/evaluate", evaluateQuestionsId);

// edit the questions
router.put("/questions/:questionId", authenticateUser, editQuestionsId);

export default  router;
