'use client';

import { useMemo } from 'react';
import { useQuizAttemptStore } from '@/store/quiz-attempt.store';
import {
  countCorrectAnswers,
  evaluateQuiz,
  QuizAnswersSnapshot,
  QuestionEvaluation,
} from '@/lib/quiz-evaluation';
import { Question } from '@/types/quiz.types';

export interface QuizAttemptActions {
  setBooleanAnswer: (quizId: number, questionId: number, value: boolean) => void;
  setInputAnswer: (quizId: number, questionId: number, value: string) => void;
  toggleCheckboxOption: (quizId: number, questionId: number, optionId: number) => void;
  markQuizAsChecked: (quizId: number) => void;
  resetQuizAttempt: (quizId: number) => void;
}

interface UseQuizAttemptControllerResult {
  answers: QuizAnswersSnapshot;
  isChecked: boolean;
  evaluationByQuestionId: Record<string, QuestionEvaluation>;
  correctAnswersCount: number;
  actions: QuizAttemptActions;
}

export const useQuizAttemptController = (
  quizId: number,
  questions: Question[]
): UseQuizAttemptControllerResult => {
  const attempt = useQuizAttemptStore((state) => state.attemptsByQuizId[String(quizId)]);

  const setBooleanAnswer = useQuizAttemptStore((state) => state.setBooleanAnswer);
  const setInputAnswer = useQuizAttemptStore((state) => state.setInputAnswer);
  const toggleCheckboxOption = useQuizAttemptStore((state) => state.toggleCheckboxOption);
  const markQuizAsChecked = useQuizAttemptStore((state) => state.markQuizAsChecked);
  const resetQuizAttempt = useQuizAttemptStore((state) => state.resetQuizAttempt);

  const answers = useMemo<QuizAnswersSnapshot>(
    () => ({
      booleanAnswers: attempt?.booleanAnswers ?? {},
      inputAnswers: attempt?.inputAnswers ?? {},
      checkboxAnswers: attempt?.checkboxAnswers ?? {},
    }),
    [attempt]
  );

  const isChecked = attempt?.isChecked ?? false;

  const evaluationByQuestionId = useMemo(
    () => evaluateQuiz(questions, answers),
    [questions, answers]
  );

  const correctAnswersCount = useMemo(
    () => countCorrectAnswers(questions, evaluationByQuestionId),
    [questions, evaluationByQuestionId]
  );

  return {
    answers,
    isChecked,
    evaluationByQuestionId,
    correctAnswersCount,
    actions: {
      setBooleanAnswer,
      setInputAnswer,
      toggleCheckboxOption,
      markQuizAsChecked,
      resetQuizAttempt,
    },
  };
};
