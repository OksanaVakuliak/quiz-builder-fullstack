import { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  const mergedClassName = [styles.card, className].filter(Boolean).join(' ');
  return (
    <div {...props} className={mergedClassName}>
      {children}
    </div>
  );
}
