import { UseFormSetValue } from 'react-hook-form';
import { CreateQuizFormValues, QuestionForm } from '@/types/quiz.types';
import { setValidatedFormValue } from './form-value.helpers';
import styles from './QuestionEditor.module.css';

interface QuestionInputFieldsProps {
  index: number;
  question: QuestionForm;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errorMessage?: string;
}

export function QuestionInputFields({
  index,
  question,
  setValue,
  errorMessage,
}: QuestionInputFieldsProps) {
  const inputId = `question-${index}-input-answer`;
  const errorId = `question-${index}-input-answer-error`;
  const hasError = Boolean(errorMessage);

  return (
    <div className={styles.typeBlock}>
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          Expected answer
        </label>
        <input
          id={inputId}
          className={styles.input}
          value={question.inputAnswer || ''}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onChange={(event) => {
            setValidatedFormValue(
              setValue,
              `questions.${index}.inputAnswer`,
              event.target.value,
            );
          }}
          placeholder="Type the expected short answer"
        />
      </div>
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
