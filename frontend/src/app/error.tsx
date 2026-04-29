'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './error.module.css';

interface AppErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppErrorPage({ error, reset }: AppErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.wrapper}>
      <Card className={styles.card}>
        <p className={styles.badge}>Unexpected error</p>
        <h1 className="pageTitle">Something broke while loading this view</h1>
        <p className="pageSubtitle">
          You can retry this action or go back to a stable page and continue
          working.
        </p>

        {error.digest ? (
          <p className={styles.digest}>Reference: {error.digest}</p>
        ) : null}

        <div className={styles.actions}>
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/quizzes">Open quizzes</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
