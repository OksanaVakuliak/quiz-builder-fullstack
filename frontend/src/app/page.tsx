import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <section>
      <h1 className="pageTitle">Build structured quizzes in minutes</h1>
      <p className="pageSubtitle">
        Create Boolean, Input, and Checkbox questions, then browse all quizzes or inspect each one
        in read-only mode.
      </p>
      <div className="heroActions">
        <Button asChild variant="primary">
          <Link href="/create">Create New Quiz</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/quizzes">Browse Quizzes</Link>
        </Button>
      </div>

      <div className={styles.sectionSpacing}>
        <Card>
          <h2 className={styles.scopeTitle}>Assessment Scope</h2>
          <p className={styles.scopeText}>
            Full-stack workflow with Express + Prisma on the backend and Next.js App Router on the
            frontend.
          </p>
        </Card>
      </div>
    </section>
  );
}
