import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '@/lib/api/quiz.api';
import { CreateQuizPayload, Quiz, QuizSummary } from '@/types/quiz.types';

export const quizQueryKeys = {
  all: ['quizzes'] as const,
  detail: (quizId: number) => ['quizzes', quizId] as const,
};

export const useQuizzesQuery = (initialData?: QuizSummary[]) => {
  return useQuery({
    queryKey: quizQueryKeys.all,
    queryFn: quizApi.getAll,
    initialData,
    enabled: initialData === undefined,
  });
};

export const useQuizDetailQuery = (quizId: number, initialData?: Quiz) => {
  return useQuery({
    queryKey: quizQueryKeys.detail(quizId),
    queryFn: () => quizApi.getById(quizId),
    enabled: quizId > 0 && initialData === undefined,
    initialData,
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => quizApi.remove(quizId),
    onSuccess: async (_result, deletedQuizId) => {
      queryClient.setQueryData<QuizSummary[]>(quizQueryKeys.all, (currentQuizzes) => {
        if (!currentQuizzes) {
          return currentQuizzes;
        }

        return currentQuizzes.filter((quiz) => quiz.id !== deletedQuizId);
      });

      queryClient.removeQueries({
        queryKey: quizQueryKeys.detail(deletedQuizId),
        exact: true,
      });
    },
  });
};

export const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();

  const toSummary = (quiz: Quiz): QuizSummary => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz.questions.length,
    createdAt: quiz.createdAt,
  });

  return useMutation({
    mutationFn: (payload: CreateQuizPayload) => quizApi.create(payload),
    onSuccess: (createdQuiz) => {
      const createdSummary = toSummary(createdQuiz);

      queryClient.setQueryData<Quiz>(quizQueryKeys.detail(createdQuiz.id), createdQuiz);

      queryClient.setQueryData<QuizSummary[]>(quizQueryKeys.all, (currentQuizzes) => {
        if (!currentQuizzes || currentQuizzes.length === 0) {
          return [createdSummary];
        }

        const withoutCreated = currentQuizzes.filter((quiz) => quiz.id !== createdSummary.id);
        return [createdSummary, ...withoutCreated];
      });
    },
  });
};
