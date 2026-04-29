import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuizDetail } from '@/components/quiz-detail/QuizDetail';
import {
  createInvalidQuizDetailMetadata,
  createQuizDetailMetadata,
  getQuizDetail,
  parseQuizId,
  ServerApiError,
} from '@/lib/server/quiz-detail.page';

interface QuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuizDetailPageProps): Promise<Metadata> {
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

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  const quizId = parseQuizId(id);

  if (Number.isNaN(quizId) || quizId <= 0) {
    return (
      <section>
        <h1 className="pageTitle">Quiz details</h1>
        <p className="pageSubtitle">Invalid quiz identifier.</p>
      </section>
    );
  }

  const initialQuiz = await getInitialQuiz(quizId);

  return (
    <section>
      <QuizDetail quizId={quizId} initialQuiz={initialQuiz} />
    </section>
  );
}
