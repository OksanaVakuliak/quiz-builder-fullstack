'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getErrorMessage } from '@/lib/error-message';
import { useDeleteQuizMutation, useQuizzesQuery } from '@/services/api/quiz.query';
import { QuizSummary } from '@/types/quiz.types';
import { AppLoader } from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { QuizListItem } from './QuizListItem';
import styles from './QuizList.module.css';

interface QuizListClientProps {
  initialQuizzes?: QuizSummary[];
}

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

export function QuizListClient({ initialQuizzes }: QuizListClientProps) {
  const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { data: quizzes = [], isPending, isError, error } = useQuizzesQuery(initialQuizzes);
  const deleteQuizMutation = useDeleteQuizMutation();

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  const handleDelete = async (id: number) => {
    setMutationErrorMessage(null);
    setDeletingQuizId(id);

    try {
      await deleteQuizMutation.mutateAsync(id);
      setToast({ message: 'Quiz deleted.', variant: 'success' });
    } catch (deleteError) {
      console.error(deleteError);
      const nextErrorMessage = getErrorMessage(deleteError, 'Failed to delete quiz. Try again.');
      setMutationErrorMessage(nextErrorMessage);
      setToast({ message: nextErrorMessage, variant: 'error' });
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

      {toast ? (
        <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      ) : null}
    </div>
  );
}
