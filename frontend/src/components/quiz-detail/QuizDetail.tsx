'use client';

import Link from 'next/link';
import { useQuizDetailQuery } from '@/services/api/quiz.query';
import { getErrorMessage } from '@/lib/error-message';
import { toQuestionKey } from '@/lib/quiz-evaluation';
import { Quiz } from '@/types/quiz.types';
import { AppLoader } from '@/components/ui/AppLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuizQuestionCard } from './QuizQuestionCard';
import { useQuizAttemptController } from './useQuizAttemptController';
import styles from './QuizDetail.module.css';

interface QuizDetailProps {
  quizId: number;
  initialQuiz?: Quiz;
}

export function QuizDetail({ quizId, initialQuiz }: QuizDetailProps) {
  const { data: quiz, isPending, isError, error } = useQuizDetailQuery(quizId, initialQuiz);
  const {
    answers,
    isChecked,
    correctAnswersCount,
    evaluationByQuestionId,
    actions: { markQuizAsChecked, resetQuizAttempt, ...questionActions },
  } = useQuizAttemptController(quizId, quiz?.questions ?? []);

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
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
        <Button asChild variant="secondary">
          <Link href="/quizzes">Back to quiz list</Link>
        </Button>
      </Card>
    );
  }

  return (
    <section className={styles.wrapper} aria-labelledby="quiz-detail-title">
      <Card>
        <h1 id="quiz-detail-title" className={`pageTitle ${styles.quizTitle}`}>
          {quiz.title}
        </h1>
        {quiz.description ? <p className="pageSubtitle">{quiz.description}</p> : null}

        <div className={styles.actionsRow} role="group" aria-label="Quiz actions">
          <Button type="button" onClick={() => markQuizAsChecked(quizId)}>
            Check answers
          </Button>
          <Button type="button" variant="secondary" onClick={() => resetQuizAttempt(quizId)}>
            Reset answers
          </Button>
          {isChecked ? (
            <p className={styles.score} role="status" aria-live="polite" aria-atomic="true">
              Score: {correctAnswersCount + '/' + quiz.questions.length}
            </p>
          ) : (
            <p className={styles.scoreHint}>Answer the questions and press Check answers.</p>
          )}
        </div>
      </Card>

      <div className={styles.questionsList} role="list" aria-label="Quiz questions">
        {quiz.questions.map((question, index) => (
          <QuizQuestionCard
            key={question.id}
            quizId={quizId}
            question={question}
            index={index}
            isChecked={isChecked}
            answers={answers}
            evaluation={evaluationByQuestionId[toQuestionKey(question.id)]}
            actions={questionActions}
          />
        ))}
      </div>
    </section>
  );
}
