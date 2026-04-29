import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.wrapper}>
      <Card className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className="pageTitle">This quiz wandered off the map</h1>
        <p className="pageSubtitle">
          The page does not exist or was moved to another route. Pick one of the
          actions below to keep going.
        </p>

        <div className={styles.actions}>
          <Button asChild variant="primary">
            <Link href="/quizzes">Back to quizzes</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
