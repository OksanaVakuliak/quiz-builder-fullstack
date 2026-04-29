import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '@/lib/api/quiz.api';
import { mapQuizToSummary } from '@/lib/quiz-summary.mapper';
import { CreateQuizPayload, Quiz, QuizSummary } from '@/types/quiz.types';

export const quizQueryKeys = {
  all: ['quizzes'] as const,
  detail: (quizId: number) => ['quizzes', quizId] as const,
};

interface BaseQuizQueryOptions<TData> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  initialData?: TData;
  enabledWhenNoInitialData?: boolean;
}

const createQuizQueryOptions = <TData>({
  queryKey,
  queryFn,
  initialData,
  enabledWhenNoInitialData = true,
}: BaseQuizQueryOptions<TData>) => {
  return {
    queryKey,
    queryFn,
    initialData,
    enabled: initialData === undefined && enabledWhenNoInitialData,
  };
};

export const useQuizzesQuery = (initialData?: QuizSummary[]) => {
  return useQuery(
    createQuizQueryOptions({
      queryKey: quizQueryKeys.all,
      queryFn: quizApi.getAll,
      initialData,
    }),
  );
};

export const useQuizDetailQuery = (quizId: number, initialData?: Quiz) => {
  return useQuery(
    createQuizQueryOptions({
      queryKey: quizQueryKeys.detail(quizId),
      queryFn: () => quizApi.getById(quizId),
      initialData,
      enabledWhenNoInitialData: quizId > 0,
    }),
  );
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => quizApi.remove(quizId),
    onMutate: async (deletedQuizId) => {
      await queryClient.cancelQueries({ queryKey: quizQueryKeys.all });

      const previousQuizzes = queryClient.getQueryData<QuizSummary[]>(
        quizQueryKeys.all,
      );

      queryClient.setQueryData<QuizSummary[]>(
        quizQueryKeys.all,
        (currentQuizzes) => {
          if (!currentQuizzes) {
            return currentQuizzes;
          }

          return currentQuizzes.filter((quiz) => quiz.id !== deletedQuizId);
        },
      );

      return { previousQuizzes };
    },
    onError: (_error, _deletedQuizId, context) => {
      if (context?.previousQuizzes) {
        queryClient.setQueryData<QuizSummary[]>(
          quizQueryKeys.all,
          context.previousQuizzes,
        );
      }
    },
    onSuccess: (_result, deletedQuizId) => {
      queryClient.removeQueries({
        queryKey: quizQueryKeys.detail(deletedQuizId),
        exact: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
    },
  });
};

export const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuizPayload) => quizApi.create(payload),
    onSuccess: (createdQuiz) => {
      const createdSummary = mapQuizToSummary(createdQuiz);

      queryClient.setQueryData<Quiz>(
        quizQueryKeys.detail(createdQuiz.id),
        createdQuiz,
      );

      queryClient.setQueryData<QuizSummary[]>(
        quizQueryKeys.all,
        (currentQuizzes) => {
          if (!currentQuizzes || currentQuizzes.length === 0) {
            return [createdSummary];
          }

          const withoutCreated = currentQuizzes.filter(
            (quiz) => quiz.id !== createdSummary.id,
          );
          return [createdSummary, ...withoutCreated];
        },
      );
    },
  });
};
