import Link from 'next/link';
import { QuizSummary } from '@/types/quiz.types';
import { Card } from '@/components/ui/Card';
import styles from './QuizListItem.module.css';

interface QuizListItemProps {
  quiz: QuizSummary;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function QuizListItem({ quiz, onDelete, isDeleting }: QuizListItemProps) {
  return (
    <Card
      className={`${styles.row} ${isDeleting ? styles.rowDeleting : ''}`}
      aria-busy={isDeleting}
      role="listitem"
    >
      <Link
        href={`/quizzes/${quiz.id}`}
        className={styles.contentLink}
        scroll={false}
        aria-label={`Open quiz ${quiz.title}`}
      >
        <p className={styles.title}>{quiz.title}</p>
        <p className={styles.meta}>{quiz.questionCount} questions</p>
      </Link>

      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(quiz.id)}
        disabled={isDeleting}
        aria-label={`Delete ${quiz.title}`}
        title="Delete quiz"
      >
        Delete
      </button>
    </Card>
  );
}
