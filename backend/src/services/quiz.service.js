const quizRepository = require('../repositories/quiz.repository');
const ApiError = require('../utils/apiError');
const { toQuizDetail, toQuizSummary } = require('../utils/quiz.mapper');

const mapQuestionToCreateInput = (question, index) => {
  const order = typeof question.order === 'number' ? question.order : index;

  const baseQuestion = {
    type: question.type,
    prompt: question.prompt,
    order,
    required: question.required ?? true,
    booleanAnswer: null,
    inputAnswer: null,
  };

  if (question.type === 'BOOLEAN') {
    return {
      ...baseQuestion,
      booleanAnswer: question.booleanAnswer,
    };
  }

  if (question.type === 'INPUT') {
    return {
      ...baseQuestion,
      inputAnswer: question.inputAnswer,
    };
  }

  return {
    ...baseQuestion,
    options: {
      create: question.options.map((option, optionIndex) => ({
        label: option.label,
        isCorrect: option.isCorrect,
        order: typeof option.order === 'number' ? option.order : optionIndex,
      })),
    },
  };
};

const createQuiz = async (payload) => {
  const createdQuiz = await quizRepository.createQuiz({
    title: payload.title,
    description: payload.description || null,
    questions: {
      create: payload.questions.map(mapQuestionToCreateInput),
    },
  });

  return toQuizDetail(createdQuiz);
};

const getAllQuizzes = async () => {
  const quizzes = await quizRepository.findAllQuizSummaries();
  return quizzes.map(toQuizSummary);
};

const getQuizById = async (id) => {
  const quiz = await quizRepository.findQuizById(id);

  if (!quiz) {
    throw new ApiError(404, `Quiz with id ${id} not found`);
  }

  return toQuizDetail(quiz);
};

const deleteQuizById = async (id) => {
  const quiz = await quizRepository.findQuizById(id);

  if (!quiz) {
    throw new ApiError(404, `Quiz with id ${id} not found`);
  }

  await quizRepository.deleteQuizById(id);
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuizById,
};
