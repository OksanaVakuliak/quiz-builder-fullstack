import { UseFormSetValue } from 'react-hook-form';
import { CreateQuizFormValues, QuestionForm } from '@/types/quiz.types';
import { setValidatedFormValue } from './form-value.helpers';
import styles from './QuestionEditor.module.css';

interface QuestionBooleanFieldsProps {
  index: number;
  question: QuestionForm;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errorMessage?: string;
}

export function QuestionBooleanFields({
  index,
  question,
  setValue,
  errorMessage,
}: QuestionBooleanFieldsProps) {
  const groupLabelId = `question-${index}-boolean-label`;
  const errorId = `question-${index}-boolean-error`;
  const hasError = Boolean(errorMessage);

  return (
    <div className={styles.typeBlock}>
      <p id={groupLabelId} className={styles.subLabel}>
        Correct answer
      </p>
      <div
        className={styles.radioRow}
        role="radiogroup"
        aria-labelledby={groupLabelId}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError}
      >
        <label
          className={styles.radioOption}
          htmlFor={`question-${index}-boolean-true`}
        >
          <input
            id={`question-${index}-boolean-true`}
            type="radio"
            name={`boolean-answer-${index}`}
            checked={question.booleanAnswer === true}
            onChange={() => {
              setValidatedFormValue(
                setValue,
                `questions.${index}.booleanAnswer`,
                true,
              );
            }}
          />
          True
        </label>

        <label
          className={styles.radioOption}
          htmlFor={`question-${index}-boolean-false`}
        >
          <input
            id={`question-${index}-boolean-false`}
            type="radio"
            name={`boolean-answer-${index}`}
            checked={question.booleanAnswer === false}
            onChange={() => {
              setValidatedFormValue(
                setValue,
                `questions.${index}.booleanAnswer`,
                false,
              );
            }}
          />
          False
        </label>
      </div>
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
