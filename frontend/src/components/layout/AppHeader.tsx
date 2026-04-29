import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="appHeader">
      <div className="container headerContent">
        <Link href="/" className="brand">
          Quiz Builder
        </Link>
        <nav className="navLinks" aria-label="Primary">
          <Link href="/create">Create Quiz</Link>
          <Link href="/quizzes">All Quizzes</Link>
        </nav>
      </div>
    </header>
  );
}
