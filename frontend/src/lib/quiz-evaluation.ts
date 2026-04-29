import { Question } from '@/types/quiz.types';

export interface QuizAnswersSnapshot {
  booleanAnswers: Record<string, boolean>;
  inputAnswers: Record<string, string>;
  checkboxAnswers: Record<string, number[]>;
}

export interface QuestionEvaluation {
  isAnswered: boolean;
  isCorrect: boolean;
}

export const toQuestionKey = (questionId: number): string => String(questionId);

const normalizeText = (value: string): string => value.trim().toLowerCase();

export const evaluateQuestion = (
  question: Question,
  answers: QuizAnswersSnapshot,
): QuestionEvaluation => {
  const questionKey = toQuestionKey(question.id);

  if (question.type === 'BOOLEAN') {
    const userAnswer = answers.booleanAnswers[questionKey];
    const expectedAnswer = question.booleanAnswer;
    const isAnswered = typeof userAnswer === 'boolean';

    return {
      isAnswered,
      isCorrect:
        isAnswered &&
        typeof expectedAnswer === 'boolean' &&
        userAnswer === expectedAnswer,
    };
  }

  if (question.type === 'INPUT') {
    const userAnswer = answers.inputAnswers[questionKey] ?? '';
    const expectedAnswer = question.inputAnswer ?? '';
    const isAnswered = userAnswer.trim().length > 0;

    return {
      isAnswered,
      isCorrect:
        isAnswered &&
        normalizeText(userAnswer) === normalizeText(expectedAnswer),
    };
  }

  const selectedOptionIds = answers.checkboxAnswers[questionKey] ?? [];
  const selectedOptions = new Set(selectedOptionIds);
  const correctOptionIds = question.options
    .filter((option) => option.isCorrect)
    .map((option) => option.id);
  const isAnswered = selectedOptionIds.length > 0;

  return {
    isAnswered,
    isCorrect:
      isAnswered &&
      selectedOptionIds.length === correctOptionIds.length &&
      correctOptionIds.every((optionId) => selectedOptions.has(optionId)),
  };
};

export const evaluateQuiz = (
  questions: Question[],
  answers: QuizAnswersSnapshot,
): Record<string, QuestionEvaluation> => {
  return questions.reduce<Record<string, QuestionEvaluation>>(
    (accumulator, question) => {
      accumulator[toQuestionKey(question.id)] = evaluateQuestion(
        question,
        answers,
      );
      return accumulator;
    },
    {},
  );
};

export const countCorrectAnswers = (
  questions: Question[],
  evaluations: Record<string, QuestionEvaluation>,
): number => {
  return questions.reduce((total, question) => {
    const evaluation = evaluations[toQuestionKey(question.id)];
    return total + (evaluation?.isCorrect ? 1 : 0);
  }, 0);
};

export const getBooleanLabel = (value: boolean | null): string => {
  if (typeof value !== 'boolean') {
    return 'Not provided';
  }

  return value ? 'True' : 'False';
};
