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
  return (
    <div className={styles.typeBlock}>
      <p className={styles.subLabel}>Correct answer</p>
      <div className={styles.radioRow}>
        <label className={styles.radioOption}>
          <input
            type="radio"
            name={`boolean-answer-${index}`}
            checked={question.booleanAnswer === true}
            onChange={() => {
              setValidatedFormValue(setValue, `questions.${index}.booleanAnswer`, true);
            }}
          />
          True
        </label>

        <label className={styles.radioOption}>
          <input
            type="radio"
            name={`boolean-answer-${index}`}
            checked={question.booleanAnswer === false}
            onChange={() => {
              setValidatedFormValue(setValue, `questions.${index}.booleanAnswer`, false);
            }}
          />
          False
        </label>
      </div>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
    </div>
  );
}
