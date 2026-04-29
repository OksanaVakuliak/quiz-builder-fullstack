'use client';

import Link from 'next/link';
import { useQuizDetailQuery } from '@/services/api/quiz.query';
import { Quiz } from '@/types/quiz.types';
import { AppLoader } from '@/components/ui/AppLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './QuizDetail.module.css';

interface QuizDetailProps {
  quizId: number;
  initialQuiz?: Quiz;
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

export function QuizDetail({ quizId, initialQuiz }: QuizDetailProps) {
  const { data: quiz, isPending, isError, error } = useQuizDetailQuery(quizId, initialQuiz);

  if (isPending && initialQuiz === undefined) {
    return (
      <Card>
        <AppLoader compact title="Loading quiz details..." subtitle="Collecting questions" />
      </Card>
    );
  }

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to load quiz details.')
    : 'Quiz not found.';

  if (!quiz) {
    return (
      <Card>
        <p className={styles.error}>{errorMessage}</p>
        <Button asChild variant="secondary">
          <Link href="/quizzes">Back to quiz list</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Card>
        <h1 className="pageTitle" style={{ margin: 0 }}>
          {quiz.title}
        </h1>
        {quiz.description ? <p className="pageSubtitle">{quiz.description}</p> : null}
      </Card>

      <div className={styles.questionsList}>
        {quiz.questions.map((question, index) => (
          <Card key={question.id} className={styles.questionCard}>
            <p className={styles.questionMeta}>
              Q{index + 1} • {question.type}
            </p>
            <p className={styles.prompt}>{question.prompt}</p>

            {question.type === 'BOOLEAN' ? (
              <p className={styles.answer}>
                Correct answer: {question.booleanAnswer ? 'True' : 'False'}
              </p>
            ) : null}

            {question.type === 'INPUT' ? (
              <p className={styles.answer}>Expected answer: {question.inputAnswer}</p>
            ) : null}

            {question.type === 'CHECKBOX' ? (
              <ul className={styles.optionList}>
                {question.options.map((option) => (
                  <li key={option.id} className={styles.optionItem}>
                    <span>{option.label}</span>
                    <span className={option.isCorrect ? styles.correct : styles.incorrect}>
                      {option.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
