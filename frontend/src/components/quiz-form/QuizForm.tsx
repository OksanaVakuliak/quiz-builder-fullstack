'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createDefaultQuestion, mapFormToPayload, normalizeQuestionOrders } from '@/lib/mappers';
import { createQuizSchema } from '@/schemas/quiz-form.schema';
import { useCreateQuizMutation } from '@/services/api/quiz.query';
import { CreateQuizFormValues, QuestionType } from '@/types/quiz.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionEditor } from './QuestionEditor';
import styles from './QuizForm.module.css';

const createInitialFormValues = (): CreateQuizFormValues => ({
  title: '',
  description: '',
  questions: [createDefaultQuestion('BOOLEAN', 0)],
});

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createQuizMutation = useCreateQuizMutation();

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: createInitialFormValues(),
  });

  const values = watch();
  const questions = values.questions || [];

  const updateQuestions = (nextQuestions: CreateQuizFormValues['questions']) => {
    setValue('questions', normalizeQuestionOrders(nextQuestions), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addQuestion = (type: QuestionType) => {
    updateQuestions([...questions, createDefaultQuestion(type, questions.length)]);
  };

  const removeQuestion = (index: number) => {
    const filtered = questions.filter((_, questionIndex) => questionIndex !== index);
    updateQuestions(filtered.length > 0 ? filtered : [createDefaultQuestion('BOOLEAN', 0)]);
  };

  const onSubmit = async (formValues: CreateQuizFormValues) => {
    setSubmitError(null);

    try {
      const payload = mapFormToPayload(formValues);
      const createdQuiz = await createQuizMutation.mutateAsync(payload);
      reset(createInitialFormValues());
      router.push(`/quizzes/${createdQuiz.id}`);
    } catch (error) {
      console.error(error);
      setSubmitError('Could not create quiz. Please verify API server is running.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Card className={styles.sectionCard}>
        <div className={styles.fieldGroup}>
          <label htmlFor="title" className={styles.label}>
            Quiz title
          </label>
          <input
            id="title"
            className={styles.input}
            value={values.title || ''}
            onChange={(event) => {
              setValue('title', event.target.value, { shouldDirty: true, shouldValidate: true });
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
            value={values.description || ''}
            onChange={(event) => {
              setValue('description', event.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              });
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
        <Button type="submit" disabled={isSubmitting || createQuizMutation.isPending}>
          {isSubmitting || createQuizMutation.isPending ? 'Creating quiz...' : 'Create quiz'}
        </Button>
      </div>
    </form>
  );
}
