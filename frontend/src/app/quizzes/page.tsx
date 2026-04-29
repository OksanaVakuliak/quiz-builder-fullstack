import { QuizListClient } from '@/components/quiz-list/QuizListClient';
import { serverQuizApi } from '@/lib/api/server/quiz.api';
import { QuizSummary } from '@/types/quiz.types';

export default async function QuizzesPage() {
  let initialQuizzes: QuizSummary[] | undefined;

  try {
    initialQuizzes = await serverQuizApi.getAll();
  } catch (error) {
    console.error(error);
  }

  return (
    <section>
      <h1 className="pageTitle">All Quizzes</h1>
      <p className="pageSubtitle">Review created quizzes and remove outdated ones.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <QuizListClient initialQuizzes={initialQuizzes} />
      </div>
    </section>
  );
}
