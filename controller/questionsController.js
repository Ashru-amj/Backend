import Question from "../models/question.js";

const postQuestions = async (req, res) => {
  try {
    // const { text, options, timer, quizId, selectedOption } = req.body;
    const { questions, quizId } = req.body;
    const userId = req.user._id;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const { questionText, options, intervalTime, selectedOption } = question;
      await Question.create({
        text: questionText,
        options,
        timer: intervalTime,
        quizId,
        userId,
        selectedOption,
      });
    }

    res.status(201).json({ status: "question created" });
  } catch (error) {
    res.status(500).json({ error: "Question creation failed" });
  }
};

const putQuestions = async (req, res) => {
  try {
    // const { text, options, timer, quizId, selectedOption } = req.body;
    const { questions, quizId } = req.body;
    const userId = req.user._id;

    await Question.deleteMany({ quizId });

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const { questionText, options, intervalTime, selectedOption } = question;
      await Question.create({
        text: questionText,
        options,
        timer: intervalTime,
        quizId,
        userId,
        selectedOption,
      });
    }

    res.status(201).json({ status: "question edited" });
  } catch (error) {
    res.status(500).json({ error: "Question edited failed" });
  }
};

const getQuestion = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

const evaluateQuestionsId = async (req, res) => {
  const questionId = req.params.questionId;
  const { userAnswer } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (
      question.options.some(
        (option) => option.isCorrect && option.text === userAnswer
      )
    ) {
      // User's answer is correct
      res.status(200).json({ message: "Correct answer", score: 1 });
    } else {
      // User's answer is incorrect
      res.status(200).json({ message: "Incorrect answer", score: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
};

// edit the questions
const editQuestionsId = async (req, res) => {
  try {
    const { text, options, timer, selectedOption } = req.body;
    const userId = req.user._id;
    const questionId = req.params.questionId; // Extract the questionId from the URL
    const question = await Question.findOneAndUpdate(
      {
        _id: questionId,
        userId, // Ensure that the question belongs to the authenticated user
      },
      {
        $set: {
          text,
          options,
          timer,
          selectedOption,
        },
      },
      { new: true }
    );

    if (!question) {
      return res
        .status(404)
        .json({ error: "Question not found or unauthorized" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: "Question update failed" });
  }
};

export {
  postQuestions,
  putQuestions,
  evaluateQuestionsId,
  editQuestionsId,
  getQuestion,
};
