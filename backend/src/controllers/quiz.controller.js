const quizService = require('../services/quiz.service');

const createQuiz = async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  res.status(201).json({ data: quiz });
};

const getAllQuizzes = async (_req, res) => {
  const quizzes = await quizService.getAllQuizzes();
  res.status(200).json({ data: quizzes });
};

const getQuizById = async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.status(200).json({ data: quiz });
};

const deleteQuizById = async (req, res) => {
  await quizService.deleteQuizById(req.params.id);
  res.status(204).send();
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuizById,
};
