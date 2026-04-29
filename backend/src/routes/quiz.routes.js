const express = require('express');
const quizController = require('../controllers/quiz.controller');
const validateRequest = require('../middlewares/validateRequest');
const {
  createQuizBodySchema,
  quizIdParamSchema,
} = require('../validators/quiz.validator');

const router = express.Router();

router.post(
  '/',
  validateRequest({ body: createQuizBodySchema }),
  quizController.createQuiz,
);
router.get('/', quizController.getAllQuizzes);
router.get(
  '/:id',
  validateRequest({ params: quizIdParamSchema }),
  quizController.getQuizById,
);
router.delete(
  '/:id',
  validateRequest({ params: quizIdParamSchema }),
  quizController.deleteQuizById,
);

module.exports = router;
