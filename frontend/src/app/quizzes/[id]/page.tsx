import { notFound } from 'next/navigation';
import { QuizDetail } from '@/components/quiz-detail/QuizDetail';
import { ServerApiError, serverQuizApi } from '@/lib/api/server/quiz.api';

interface QuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  const quizId = Number(id);

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
