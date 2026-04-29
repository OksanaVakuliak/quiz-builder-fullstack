const mapQuestion = (question) => ({
  id: question.id,
  type: question.type,
  prompt: question.prompt,
  order: question.order,
  required: question.required,
  booleanAnswer: question.type === 'BOOLEAN' ? question.booleanAnswer : null,
  inputAnswer: question.type === 'INPUT' ? question.inputAnswer : null,
  options:
    question.type === 'CHECKBOX'
      ? question.options.map((option) => ({
          id: option.id,
          label: option.label,
          isCorrect: option.isCorrect,
          order: option.order,
        }))
      : [],
});

const toQuizSummary = (quiz) => ({
  id: quiz.id,
  title: quiz.title,
  questionCount: quiz._count.questions,
  createdAt: quiz.createdAt,
});

const toQuizDetail = (quiz) => ({
  id: quiz.id,
  title: quiz.title,
  description: quiz.description,
  createdAt: quiz.createdAt,
  updatedAt: quiz.updatedAt,
  questions: quiz.questions.map(mapQuestion),
});

module.exports = {
  toQuizSummary,
  toQuizDetail,
};
