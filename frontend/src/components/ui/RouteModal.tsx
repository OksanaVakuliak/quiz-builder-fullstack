'use client';

import { ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RouteModal.module.css';

interface RouteModalProps {
  children: ReactNode;
  fallbackHref?: string;
  ariaLabel?: string;
}

export function RouteModal({
  children,
  fallbackHref = '/quizzes',
  ariaLabel = 'Quiz details dialog',
}: RouteModalProps) {
  const router = useRouter();

  const closeModal = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }, [fallbackHref, router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
      role="presentation"
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Close quiz details"
          title="Close"
        >
          ×
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
