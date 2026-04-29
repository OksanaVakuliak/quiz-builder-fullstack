import { Quiz, QuizSummary } from '@/types/quiz.types';

export const mapQuizToSummary = (quiz: Quiz): QuizSummary => ({
  id: quiz.id,
  title: quiz.title,
  questionCount: quiz.questions.length,
  createdAt: quiz.createdAt,
});
