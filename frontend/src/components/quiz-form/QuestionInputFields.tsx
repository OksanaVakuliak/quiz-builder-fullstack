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
  return (
    <div className={styles.typeBlock}>
      <label className={styles.field}>
        <span className={styles.label}>Expected answer</span>
        <input
          className={styles.input}
          value={question.inputAnswer || ''}
          onChange={(event) => {
            setValidatedFormValue(setValue, `questions.${index}.inputAnswer`, event.target.value);
          }}
          placeholder="Type the expected short answer"
        />
      </label>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
    </div>
  );
}
