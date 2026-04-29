import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuizDetail } from '@/components/quiz-detail/QuizDetail';
import { createPageMetadata } from '@/lib/metadata';
import { ServerApiError, serverQuizApi } from '@/lib/api/server/quiz.api';

interface QuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: QuizDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const quizId = Number(id);

  if (Number.isNaN(quizId) || quizId <= 0) {
    return createPageMetadata({
      title: 'Quiz details',
      description: 'Open a quiz to review questions and solve it.',
      path: '/quizzes',
    });
  }

  try {
    const quiz = await serverQuizApi.getById(quizId);

    return createPageMetadata({
      title: quiz.title,
      description: quiz.description?.trim() || 'Open this quiz and check your answers.',
      path: `/quizzes/${quizId}`,
      type: 'article',
    });
  } catch (_error) {
    return createPageMetadata({
      title: `Quiz #${quizId}`,
      description: 'Open this quiz and check your answers.',
      path: `/quizzes/${quizId}`,
      type: 'article',
    });
  }
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
