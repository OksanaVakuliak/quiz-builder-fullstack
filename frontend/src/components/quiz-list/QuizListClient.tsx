'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDeleteQuizMutation, useQuizzesQuery } from '@/services/api/quiz.query';
import { QuizSummary } from '@/types/quiz.types';
import { AppLoader } from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuizListItem } from './QuizListItem';
import styles from './QuizList.module.css';

interface QuizListClientProps {
  initialQuizzes?: QuizSummary[];
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

export function QuizListClient({ initialQuizzes }: QuizListClientProps) {
  const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<string | null>(null);

  const { data: quizzes = [], isPending, isError, error } = useQuizzesQuery(initialQuizzes);
  const deleteQuizMutation = useDeleteQuizMutation();

  const handleDelete = async (id: number) => {
    setMutationErrorMessage(null);
    setDeletingQuizId(id);

    try {
      await deleteQuizMutation.mutateAsync(id);
    } catch (deleteError) {
      console.error(deleteError);
      setMutationErrorMessage('Failed to delete quiz. Try again.');
    } finally {
      setDeletingQuizId(null);
    }
  };

  if (isPending && initialQuizzes === undefined) {
    return (
      <Card>
        <AppLoader compact title="Loading quizzes..." subtitle="Fetching latest items" />
      </Card>
    );
  }

  const loadErrorMessage =
    isError && quizzes.length === 0
      ? getErrorMessage(error, 'Unable to load quizzes. Check backend connection.')
      : null;

  const errorMessage = mutationErrorMessage || loadErrorMessage;

  return (
    <div className={styles.listWrapper}>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      {quizzes.length === 0 ? (
        <Card>
          <p className={styles.emptyText}>No quizzes available yet.</p>
          <Button asChild variant="secondary">
            <Link href="/create">Create first quiz</Link>
          </Button>
        </Card>
      ) : (
        <div className={styles.list}>
          {quizzes.map((quiz) => (
            <QuizListItem
              key={quiz.id}
              quiz={quiz}
              onDelete={handleDelete}
              isDeleting={deletingQuizId === quiz.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
