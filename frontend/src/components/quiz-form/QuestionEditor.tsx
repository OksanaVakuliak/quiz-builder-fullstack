import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import { createDefaultQuestion } from '@/lib/mappers';
import { CreateQuizFormValues, QuestionForm, QuestionType } from '@/types/quiz.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { setValidatedFormValue } from './form-value.helpers';
import { QuestionTypeFields } from './QuestionTypeFields';
import styles from './QuestionEditor.module.css';

interface QuestionEditorProps {
  index: number;
  question: QuestionForm;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionEditor({
  index,
  question,
  setValue,
  errors,
  onRemove,
  canRemove,
}: QuestionEditorProps) {
  const questionErrors = errors.questions?.[index];

  const handleTypeChange = (nextType: QuestionType) => {
    const template = createDefaultQuestion(nextType, question.order);

    setValidatedFormValue(setValue, `questions.${index}`, {
      ...template,
      clientId: question.clientId || template.clientId,
      prompt: question.prompt,
      required: question.required,
    });
  };

  return (
    <Card className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Question {index + 1}</h3>
        <Button type="button" variant="danger" onClick={onRemove} disabled={!canRemove}>
          Remove
        </Button>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Prompt</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={question.prompt}
            onChange={(event) => {
              setValidatedFormValue(setValue, `questions.${index}.prompt`, event.target.value);
            }}
            placeholder="Write your question prompt"
          />
          {questionErrors?.prompt?.message ? (
            <span className={styles.error}>{questionErrors.prompt.message}</span>
          ) : null}
        </label>

        <div className={styles.inlineFields}>
          <label className={styles.field}>
            <span className={styles.label}>Question type</span>
            <select
              className={styles.select}
              value={question.type}
              onChange={(event) => {
                handleTypeChange(event.target.value as QuestionType);
              }}
            >
              <option value="BOOLEAN">Boolean</option>
              <option value="INPUT">Input</option>
              <option value="CHECKBOX">Checkbox</option>
            </select>
          </label>

          <label className={styles.requiredToggle}>
            <input
              type="checkbox"
              checked={question.required}
              onChange={(event) => {
                setValidatedFormValue(
                  setValue,
                  `questions.${index}.required`,
                  event.target.checked
                );
              }}
            />
            Required
          </label>
        </div>
      </div>

      <QuestionTypeFields index={index} question={question} setValue={setValue} errors={errors} />
    </Card>
  );
}
