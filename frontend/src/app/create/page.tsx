import { QuizForm } from '@/components/quiz-form/QuizForm';
import styles from './page.module.css';

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
