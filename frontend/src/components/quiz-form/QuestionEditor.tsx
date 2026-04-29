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
  const titleId = `question-${index}-title`;
  const promptId = `question-${index}-prompt`;
  const promptErrorId = `question-${index}-prompt-error`;
  const typeId = `question-${index}-type`;
  const requiredId = `question-${index}-required`;
  const hasPromptError = Boolean(questionErrors?.prompt?.message);

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
    <Card className={styles.wrapper} role="listitem" aria-labelledby={titleId}>
      <div className={styles.headerRow}>
        <h3 id={titleId} className={styles.title}>
          Question {index + 1}
        </h3>
        <Button
          type="button"
          variant="danger"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove question ${index + 1}`}
        >
          Remove
        </Button>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor={promptId} className={styles.label}>
            Prompt
          </label>
          <textarea
            id={promptId}
            className={styles.textarea}
            rows={3}
            value={question.prompt}
            aria-invalid={hasPromptError}
            aria-describedby={hasPromptError ? promptErrorId : undefined}
            onChange={(event) => {
              setValidatedFormValue(setValue, `questions.${index}.prompt`, event.target.value);
            }}
            placeholder="Write your question prompt"
          />
          {hasPromptError ? (
            <span id={promptErrorId} className={styles.error} role="alert">
              {questionErrors?.prompt?.message}
            </span>
          ) : null}
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.field}>
            <label htmlFor={typeId} className={styles.label}>
              Question type
            </label>
            <select
              id={typeId}
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
          </div>

          <label className={styles.requiredToggle} htmlFor={requiredId}>
            <input
              id={requiredId}
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
