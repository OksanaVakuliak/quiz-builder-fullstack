import { QuizForm } from '@/components/quiz-form/QuizForm';

export default function CreateQuizPage() {
  return (
    <section>
      <h1 className="pageTitle">Create Quiz</h1>
      <p className="pageSubtitle">Build your quiz with dynamic question types and validation.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <QuizForm />
      </div>
    </section>
  );
}
