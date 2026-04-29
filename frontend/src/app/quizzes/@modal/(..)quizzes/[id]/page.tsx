import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuizDetail } from '@/components/quiz-detail/QuizDetail';
import { RouteModal } from '@/components/ui/RouteModal';
import {
  createInvalidQuizDetailMetadata,
  createQuizDetailMetadata,
  getQuizDetail,
  parseQuizId,
  ServerApiError,
} from '@/lib/server/quiz-detail.page';

interface ModalQuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ModalQuizDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const quizId = parseQuizId(id);

  if (Number.isNaN(quizId) || quizId <= 0) {
    return createInvalidQuizDetailMetadata();
  }

  return createQuizDetailMetadata(quizId);
}

const getInitialQuiz = async (quizId: number) => {
  try {
    return await getQuizDetail(quizId);
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
