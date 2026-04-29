import {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  asChild?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  asChild = false,
  ...props
}: ButtonProps) {
  const className = [styles.button, styles[variant], props.className]
    .filter(Boolean)
    .join(' ');

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: [className, child.props.className].filter(Boolean).join(' '),
    });
  }

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
