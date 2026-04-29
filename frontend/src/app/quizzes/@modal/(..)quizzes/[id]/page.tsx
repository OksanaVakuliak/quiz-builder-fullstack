import { notFound } from 'next/navigation';
import { QuizDetail } from '@/components/quiz-detail/QuizDetail';
import { RouteModal } from '@/components/ui/RouteModal';
import { ServerApiError, serverQuizApi } from '@/lib/api/server/quiz.api';

interface ModalQuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const parseQuizId = (rawId: string): number => {
  const directId = Number(rawId);

  if (Number.isInteger(directId) && directId > 0) {
    return directId;
  }

  // Some intercepted RSC navigations can pass id with routing markers around it.
  const tailNumber = rawId.match(/\d+/g)?.at(-1);
  const normalizedId = Number(tailNumber);

  if (Number.isInteger(normalizedId) && normalizedId > 0) {
    return normalizedId;
  }

  return Number.NaN;
};

const getInitialQuiz = async (quizId: number) => {
  try {
    return await serverQuizApi.getById(quizId);
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
};

export default async function ModalQuizDetailPage({ params }: ModalQuizDetailPageProps) {
  const { id } = await params;
  const quizId = parseQuizId(id);

  if (Number.isNaN(quizId) || quizId <= 0) {
    notFound();
  }

  const initialQuiz = await getInitialQuiz(quizId);

  return (
    <RouteModal>
      <QuizDetail quizId={quizId} initialQuiz={initialQuiz} />
    </RouteModal>
  );
}
