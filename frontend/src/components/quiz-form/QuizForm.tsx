'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionEditor } from './QuestionEditor';
import { useQuizFormController } from './useQuizFormController';
import styles from './QuizForm.module.css';

export function QuizForm() {
  const {
    errors,
    isSubmitting,
    isCreatePending,
    submitError,
    title,
    description,
    questions,
    setValue,
    submit,
    addQuestion,
    removeQuestion,
    setTitle,
    setDescription,
  } = useQuizFormController();

  return (
    <form className={styles.form} onSubmit={submit}>
      <Card className={styles.sectionCard}>
        <div className={styles.fieldGroup}>
          <label htmlFor="title" className={styles.label}>
            Quiz title
          </label>
          <input
            id="title"
            className={styles.input}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Frontend Knowledge Check"
          />
          {errors.title?.message ? <p className={styles.error}>{errors.title.message}</p> : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="description" className={styles.label}>
            Description (optional)
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            rows={3}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            placeholder="A short intro for quiz reviewers"
          />
          {errors.description?.message ? (
            <p className={styles.error}>{errors.description.message}</p>
          ) : null}
        </div>
      </Card>

      <Card className={styles.sectionCard}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Questions</h2>
          <div className={styles.questionButtons}>
            <Button type="button" variant="secondary" onClick={() => addQuestion('BOOLEAN')}>
              Add Boolean
            </Button>
            <Button type="button" variant="secondary" onClick={() => addQuestion('INPUT')}>
              Add Input
            </Button>
            <Button type="button" variant="secondary" onClick={() => addQuestion('CHECKBOX')}>
              Add Checkbox
            </Button>
          </div>
        </div>

        <div className={styles.questionsStack}>
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.clientId || `question-${index}`}
              index={index}
              question={question}
              setValue={setValue}
              errors={errors}
              onRemove={() => removeQuestion(index)}
              canRemove={questions.length > 1}
            />
          ))}
        </div>

        {errors.questions?.message ? (
          <p className={styles.error}>{errors.questions.message}</p>
        ) : null}
      </Card>

      {submitError ? <p className={styles.error}>{submitError}</p> : null}

      <div className={styles.submitRow}>
        <Button type="submit" disabled={isSubmitting || isCreatePending}>
          {isSubmitting || isCreatePending ? 'Creating quiz...' : 'Create quiz'}
        </Button>
      </div>
    </form>
  );
}
