'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { createDefaultQuestion, mapFormToPayload, normalizeQuestionOrders } from '@/lib/mappers';
import { createQuizSchema } from '@/schemas/quiz-form.schema';
import { useCreateQuizMutation } from '@/services/api/quiz.query';
import { CreateQuizFormValues, QuestionType } from '@/types/quiz.types';
import { setValidatedFormValue } from './form-value.helpers';

const createInitialFormValues = (): CreateQuizFormValues => ({
  title: '',
  description: '',
  questions: [createDefaultQuestion('BOOLEAN', 0)],
});

export const useQuizFormController = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createQuizMutation = useCreateQuizMutation();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: createInitialFormValues(),
  });

  const title = useWatch({ control, name: 'title' }) || '';
  const description = useWatch({ control, name: 'description' }) || '';
  const watchedQuestions = useWatch({ control, name: 'questions' });
  const questions = watchedQuestions || [];

  const updateQuestions = (nextQuestions: CreateQuizFormValues['questions']) => {
    setValidatedFormValue(setValue, 'questions', normalizeQuestionOrders(nextQuestions));
  };

  const addQuestion = (type: QuestionType) => {
    updateQuestions([...questions, createDefaultQuestion(type, questions.length)]);
  };

  const removeQuestion = (index: number) => {
    const filtered = questions.filter((_, questionIndex) => questionIndex !== index);
    updateQuestions(filtered.length > 0 ? filtered : [createDefaultQuestion('BOOLEAN', 0)]);
  };

  const submit = handleSubmit(async (formValues) => {
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
  });

  return {
    errors,
    isSubmitting,
    isCreatePending: createQuizMutation.isPending,
    submitError,
    title,
    description,
    questions,
    setValue,
    submit,
    addQuestion,
    removeQuestion,
    setTitle: (value: string) => setValidatedFormValue(setValue, 'title', value),
    setDescription: (value: string) => setValidatedFormValue(setValue, 'description', value),
  };
};
