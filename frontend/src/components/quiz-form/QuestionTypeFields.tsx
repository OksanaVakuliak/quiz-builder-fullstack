import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import { createDefaultOption } from '@/lib/mappers';
import { CreateQuizFormValues, QuestionForm } from '@/types/quiz.types';
import { Button } from '@/components/ui/Button';
import styles from './QuestionEditor.module.css';

interface QuestionTypeFieldsProps {
  index: number;
  question: QuestionForm;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
}

export function QuestionTypeFields({ index, question, setValue, errors }: QuestionTypeFieldsProps) {
  const questionErrors = errors.questions?.[index];

  if (question.type === 'BOOLEAN') {
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
                setValue(`questions.${index}.booleanAnswer`, true, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
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
                setValue(`questions.${index}.booleanAnswer`, false, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            False
          </label>
        </div>
        {questionErrors?.booleanAnswer?.message ? (
          <p className={styles.error}>{questionErrors.booleanAnswer.message}</p>
        ) : null}
      </div>
    );
  }

  if (question.type === 'INPUT') {
    return (
      <div className={styles.typeBlock}>
        <label className={styles.field}>
          <span className={styles.label}>Expected answer</span>
          <input
            className={styles.input}
            value={question.inputAnswer || ''}
            onChange={(event) => {
              setValue(`questions.${index}.inputAnswer`, event.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            placeholder="Type the expected short answer"
          />
        </label>
        {questionErrors?.inputAnswer?.message ? (
          <p className={styles.error}>{questionErrors.inputAnswer.message}</p>
        ) : null}
      </div>
    );
  }

  const options = question.options || [createDefaultOption(0), createDefaultOption(1)];

  const setOptions = (nextOptions: typeof options) => {
    setValue(
      `questions.${index}.options`,
      nextOptions.map((option, optionIndex) => ({
        ...option,
        order: optionIndex,
      })),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
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
        <p className={styles.subLabel}>Options (select correct answers)</p>
        <Button type="button" variant="secondary" onClick={addOption}>
          Add option
        </Button>
      </div>

      <div className={styles.optionsStack}>
        {options.map((option, optionIndex) => (
          <div key={option.clientId || `option-${optionIndex}`} className={styles.optionRow}>
            <input
              className={styles.input}
              value={option.label}
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
            <label className={styles.correctToggle}>
              <input
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
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {questionErrors?.options?.message ? (
        <p className={styles.error}>{questionErrors.options.message}</p>
      ) : null}
    </div>
  );
}
