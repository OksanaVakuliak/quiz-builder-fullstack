import { Suspense } from 'react';

interface QuizzesLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function QuizzesLayout({ children, modal }: QuizzesLayoutProps) {
  return (
    <>
      {children}
      <Suspense fallback={null}>{modal}</Suspense>
    </>
  );
}
