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

  const titleErrorId = 'quiz-title-error';
  const descriptionErrorId = 'quiz-description-error';
  const questionsErrorId = 'quiz-questions-error';
  const submitErrorId = 'quiz-submit-error';

  const hasTitleError = Boolean(errors.title?.message);
  const hasDescriptionError = Boolean(errors.description?.message);
  const hasQuestionsError = Boolean(errors.questions?.message);
  const hasSubmitError = Boolean(submitError);

  return (
    <form
      className={styles.form}
      onSubmit={submit}
      aria-busy={isSubmitting || isCreatePending}
      aria-describedby={hasSubmitError ? submitErrorId : undefined}
    >
      <Card className={styles.sectionCard}>
        <div className={styles.fieldGroup}>
          <label htmlFor="title" className={styles.label}>
            Quiz title
          </label>
          <input
            id="title"
            className={styles.input}
            value={title}
            required
            aria-required="true"
            aria-invalid={hasTitleError}
            aria-describedby={hasTitleError ? titleErrorId : undefined}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Frontend Knowledge Check"
          />
          {hasTitleError ? (
            <p id={titleErrorId} className={styles.error} role="alert">
              {errors.title?.message}
            </p>
          ) : null}
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
            aria-invalid={hasDescriptionError}
            aria-describedby={
              hasDescriptionError ? descriptionErrorId : undefined
            }
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            placeholder="A short intro for quiz reviewers"
          />
          {hasDescriptionError ? (
            <p id={descriptionErrorId} className={styles.error} role="alert">
              {errors.description?.message}
            </p>
          ) : null}
        </div>
      </Card>

      <Card className={styles.sectionCard}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Questions</h2>
          <fieldset className={styles.questionButtons}>
            <legend className="srOnly">Add a question type</legend>
            <Button
              type="button"
              variant="secondary"
              onClick={() => addQuestion('BOOLEAN')}
              aria-label="Add Boolean question"
            >
              Add Boolean
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => addQuestion('INPUT')}
              aria-label="Add Input question"
            >
              Add Input
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => addQuestion('CHECKBOX')}
              aria-label="Add Checkbox question"
            >
              Add Checkbox
            </Button>
          </fieldset>
        </div>

        <div
          className={styles.questionsStack}
          role="list"
          aria-label="Quiz questions"
        >
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

        {hasQuestionsError ? (
          <p id={questionsErrorId} className={styles.error} role="alert">
            {errors.questions?.message}
          </p>
        ) : null}
      </Card>

      {hasSubmitError ? (
        <p
          id={submitErrorId}
          className={styles.error}
          role="alert"
          aria-live="assertive"
        >
          {submitError}
        </p>
      ) : null}

      <div className={styles.submitRow}>
        <Button type="submit" disabled={isSubmitting || isCreatePending}>
          {isSubmitting || isCreatePending ? 'Creating quiz...' : 'Create quiz'}
        </Button>
      </div>

      <span className="srOnly" role="status" aria-live="polite">
        {isSubmitting || isCreatePending ? 'Quiz creation in progress' : ''}
      </span>
    </form>
  );
}
