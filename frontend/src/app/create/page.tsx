import type { Metadata } from 'next';
import { QuizForm } from '@/components/quiz-form/QuizForm';
import { createPageMetadata } from '@/lib/metadata';
import styles from './page.module.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Create Quiz',
  description: 'Create a new quiz with dynamic question types and built-in validation.',
  path: '/create',
});

export default function CreateQuizPage() {
  return (
    <section>
      <h1 className="pageTitle">Create Quiz</h1>
      <p className="pageSubtitle">Build your quiz with dynamic question types and validation.</p>
      <div className={styles.sectionSpacing}>
        <QuizForm />
      </div>
    </section>
  );
}
