const prisma = require('../config/prisma');

const quizInclude = {
  questions: {
    orderBy: {
      order: 'asc',
    },
    include: {
      options: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  },
};

const createQuiz = (data) => {
  return prisma.quiz.create({
    data,
    include: quizInclude,
  });
};

const findAllQuizSummaries = () => {
  return prisma.quiz.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });
};

const findQuizById = (id) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: quizInclude,
  });
};

const deleteQuizById = (id) => {
  return prisma.quiz.delete({
    where: { id },
  });
};

module.exports = {
  createQuiz,
  findAllQuizSummaries,
  findQuizById,
  deleteQuizById,
};
