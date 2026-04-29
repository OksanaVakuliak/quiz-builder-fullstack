import { UseFormSetValue } from 'react-hook-form';
import { createDefaultOption } from '@/lib/mappers';
import { CreateQuizFormValues, QuestionForm } from '@/types/quiz.types';
import { Button } from '@/components/ui/Button';
import { normalizeOptionOrders, setValidatedFormValue } from './form-value.helpers';
import styles from './QuestionEditor.module.css';

interface QuestionCheckboxFieldsProps {
  index: number;
  question: QuestionForm;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errorMessage?: string;
}

export function QuestionCheckboxFields({
  index,
  question,
  setValue,
  errorMessage,
}: QuestionCheckboxFieldsProps) {
  const options = question.options || [createDefaultOption(0), createDefaultOption(1)];
  const optionsLabelId = `question-${index}-options-label`;
  const optionsErrorId = `question-${index}-options-error`;
  const hasError = Boolean(errorMessage);

  const setOptions = (nextOptions: typeof options) => {
    setValidatedFormValue(
      setValue,
      `questions.${index}.options`,
      normalizeOptionOrders(nextOptions)
    );
  };

  const addOption = () => {
    setOptions([...options, createDefaultOption(options.length)]);
  };

  const removeOption = (optionIndex: number) => {
    const remaining = options.filter((_, indexKey) => indexKey !== optionIndex);

    if (remaining.length >= 2) {
      setOptions(remaining);
    }
  };

  return (
    <div className={styles.typeBlock}>
      <div className={styles.checkboxHead}>
        <p id={optionsLabelId} className={styles.subLabel}>
          Options (select correct answers)
        </p>
        <Button type="button" variant="secondary" onClick={addOption}>
          Add option
        </Button>
      </div>

      <div
        className={styles.optionsStack}
        role="group"
        aria-labelledby={optionsLabelId}
        aria-describedby={hasError ? optionsErrorId : undefined}
      >
        {options.map((option, optionIndex) => (
          <div key={option.clientId || `option-${optionIndex}`} className={styles.optionRow}>
            <label htmlFor={`question-${index}-option-${optionIndex}-label`} className="srOnly">
              Option {optionIndex + 1} text
            </label>
            <input
              id={`question-${index}-option-${optionIndex}-label`}
              className={styles.input}
              value={option.label}
              aria-label={`Option ${optionIndex + 1} text`}
              aria-invalid={hasError}
              onChange={(event) => {
                const nextOptions = [...options];
                nextOptions[optionIndex] = {
                  ...nextOptions[optionIndex],
                  label: event.target.value,
                };
                setOptions(nextOptions);
              }}
              placeholder={`Option ${optionIndex + 1}`}
            />
            <label
              className={styles.correctToggle}
              htmlFor={`question-${index}-option-${optionIndex}-correct`}
            >
              <input
                id={`question-${index}-option-${optionIndex}-correct`}
                type="checkbox"
                checked={option.isCorrect}
                onChange={(event) => {
                  const nextOptions = [...options];
                  nextOptions[optionIndex] = {
                    ...nextOptions[optionIndex],
                    isCorrect: event.target.checked,
                  };
                  setOptions(nextOptions);
                }}
              />
              Correct
            </label>
            <Button
              type="button"
              variant="danger"
              onClick={() => removeOption(optionIndex)}
              disabled={options.length <= 2}
              aria-label={`Remove option ${optionIndex + 1}`}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {hasError ? (
        <p id={optionsErrorId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
