import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, variant = 'success', onClose }: ToastProps) {
  return (
    <div
      className={`${styles.toast} ${variant === 'error' ? styles.error : styles.success}`}
      role="status"
      aria-live="polite"
    >
      <p className={styles.message}>{message}</p>
      <button type="button" onClick={onClose} className={styles.close} aria-label="Close toast">
        ×
      </button>
    </div>
  );
}
