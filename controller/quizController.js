import Quiz from "../models/quiz.js";
import Question from "../models/question.js";

// Create a new quiz
const CreateQuiz = async (req, res) => {
  try {
    const { title, type } = req.body;
    const userId = req.user._id;

    const quiz = new Quiz({ title, type, userId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Quiz creation failed" });
  }
};

// Get all quizzes
const getQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// Share a quiz by generating a unique link or code
const shareQuizLink = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Generate a unique link or code for sharing
    //const shareLink = `http://localhost:${process.env.PORT}/quiz/${quizId}`;
    const shareLink = `https://quizzie-mu.vercel.app/quiz/${quizId}`;

    res.status(200).json({ shareLink });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate share link" });
  }
};

// Track impressions for a quiz
const ImpressionCount = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Increment the impression count
    quiz.impressionCount = (quiz.impressionCount || 0) + 1;
    const quizImpression = await quiz.save();

    res
      .status(200)
      .json({ message: "Impression tracked successfully", quizImpression });
  } catch (error) {
    res.status(500).json({ error: "Failed to track impression" });
  }
};

const quizRead = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to track impression" });
  }
};

// checking for answers
const checkAnswer = async (req, res) => {
  const { chooseAnswers, quizId } = req.body;
  const quiz = await Quiz.findById(quizId);

  let score = 0;

  for (const answer of chooseAnswers) {
    const question = await Question.findById(answer.questionId);
    if (!question) continue;
    const correctAnswer = question.options.find((opt) => opt.isCorrect);
    const correct = answer.id?.toString() === correctAnswer._id?.toString();
    const updateField = correct ? "correct" : "incorrect";
    await Question.findByIdAndUpdate(answer.questionId, {
      $inc: { [updateField]: 1, attempt: 1 },
    });
    if (correct) {
      score++;
    }
  }

  res.status(200).json({ status: true, score });
};

const deleteQuizId = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user._id; // Use _id of the user, not quizId

    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    await Quiz.deleteOne({ _id: quizId }); // Use deleteOne to delete the quiz

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Quiz deletion failed" });
  }
};

// PUT /quizzes/:quizId
const updateQuizId = async (req, res) => {
  try {
    const quizId = req.params.quizId; // Extract the quiz ID from the route parameters
    const { title, type } = req.body;

    // Check if the user has permission to edit this quiz (e.g., make sure the user owns the quiz)
    const userId = req.user._id;
    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Update the quiz with the new title and type
    quiz.title = title;
    quiz.type = type;

    // Save the updated quiz
    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Quiz update failed" });
  }
};

// Add a new question to a quiz
const AddQuestion = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id });
    const questions = await Question.find({ userId: req.user._id });
    const trendy = quizzes.filter((quiz) => {
      return quiz.impressionCount > 10;
    });
    let impression = 0;
    for (let i = 0; i < quizzes.length; i++) {
      impression += quizzes[i].impressionCount;
    }
    res.status(201).json({
      quizzes: quizzes.length,
      questions: questions.length,
      impression,
      trendy,
    });
  } catch (error) {
    res.status(500).json({ error: "Question creation failed" });
  }
};

export {
  getQuiz,
  ImpressionCount,
  CreateQuiz,
  shareQuizLink,
  checkAnswer,
  deleteQuizId,
  updateQuizId,
  quizRead,
  AddQuestion,
};
