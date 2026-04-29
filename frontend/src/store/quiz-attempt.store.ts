'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface QuizAttempt {
  isChecked: boolean;
  booleanAnswers: Record<string, boolean>;
  inputAnswers: Record<string, string>;
  checkboxAnswers: Record<string, number[]>;
}

interface QuizAttemptState {
  attemptsByQuizId: Record<string, QuizAttempt>;
  setBooleanAnswer: (quizId: number, questionId: number, value: boolean) => void;
  setInputAnswer: (quizId: number, questionId: number, value: string) => void;
  toggleCheckboxOption: (quizId: number, questionId: number, optionId: number) => void;
  markQuizAsChecked: (quizId: number) => void;
  resetQuizAttempt: (quizId: number) => void;
}

const createEmptyAttempt = (): QuizAttempt => ({
  isChecked: false,
  booleanAnswers: {},
  inputAnswers: {},
  checkboxAnswers: {},
});

const withAttempt = (
  attemptsByQuizId: Record<string, QuizAttempt>,
  quizId: number,
  updater: (attempt: QuizAttempt) => QuizAttempt
): Record<string, QuizAttempt> => {
  const quizKey = String(quizId);
  const currentAttempt = attemptsByQuizId[quizKey] ?? createEmptyAttempt();

  return {
    ...attemptsByQuizId,
    [quizKey]: updater(currentAttempt),
  };
};

export const useQuizAttemptStore = create<QuizAttemptState>()(
  persist(
    (set) => ({
      attemptsByQuizId: {},
      setBooleanAnswer: (quizId, questionId, value) => {
        set((state) => ({
          attemptsByQuizId: withAttempt(state.attemptsByQuizId, quizId, (attempt) => ({
            ...attempt,
            isChecked: false,
            booleanAnswers: {
              ...attempt.booleanAnswers,
              [String(questionId)]: value,
            },
          })),
        }));
      },
      setInputAnswer: (quizId, questionId, value) => {
        set((state) => ({
          attemptsByQuizId: withAttempt(state.attemptsByQuizId, quizId, (attempt) => ({
            ...attempt,
            isChecked: false,
            inputAnswers: {
              ...attempt.inputAnswers,
              [String(questionId)]: value,
            },
          })),
        }));
      },
      toggleCheckboxOption: (quizId, questionId, optionId) => {
        set((state) => ({
          attemptsByQuizId: withAttempt(state.attemptsByQuizId, quizId, (attempt) => {
            const questionKey = String(questionId);
            const selectedOptionIds = attempt.checkboxAnswers[questionKey] ?? [];
            const hasOption = selectedOptionIds.includes(optionId);

            return {
              ...attempt,
              isChecked: false,
              checkboxAnswers: {
                ...attempt.checkboxAnswers,
                [questionKey]: hasOption
                  ? selectedOptionIds.filter((selectedId) => selectedId !== optionId)
                  : [...selectedOptionIds, optionId],
              },
            };
          }),
        }));
      },
      markQuizAsChecked: (quizId) => {
        set((state) => ({
          attemptsByQuizId: withAttempt(state.attemptsByQuizId, quizId, (attempt) => ({
            ...attempt,
            isChecked: true,
          })),
        }));
      },
      resetQuizAttempt: (quizId) => {
        set((state) => {
          const nextAttemptsByQuizId = { ...state.attemptsByQuizId };
          delete nextAttemptsByQuizId[String(quizId)];

          return {
            attemptsByQuizId: nextAttemptsByQuizId,
          };
        });
      },
    }),
    {
      name: 'quiz-attempt-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        attemptsByQuizId: state.attemptsByQuizId,
      }),
    }
  )
);
