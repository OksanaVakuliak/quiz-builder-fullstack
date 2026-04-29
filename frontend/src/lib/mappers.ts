import {
  CheckboxOptionForm,
  CreateQuizFormValues,
  CreateQuizPayload,
  QuestionForm,
  QuestionType,
} from '@/types/quiz.types';

const createClientId = () =>
  `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const createDefaultOption = (order: number): CheckboxOptionForm => ({
  clientId: createClientId(),
  label: '',
  isCorrect: false,
  order,
});

export const createDefaultQuestion = (
  type: QuestionType,
  order: number,
): QuestionForm => {
  const clientId = createClientId();

  if (type === 'BOOLEAN') {
    return {
      clientId,
      type,
      prompt: '',
      order,
      required: true,
      booleanAnswer: true,
    };
  }

  if (type === 'INPUT') {
    return {
      clientId,
      type,
      prompt: '',
      order,
      required: true,
      inputAnswer: '',
    };
  }

  return {
    clientId,
    type,
    prompt: '',
    order,
    required: true,
    options: [createDefaultOption(0), createDefaultOption(1)],
  };
};

export const normalizeQuestionOrders = (
  questions: QuestionForm[],
): QuestionForm[] => {
  return questions.map((question, questionIndex) => ({
    clientId: question.clientId || createClientId(),
    ...question,
    order: questionIndex,
    options: question.options?.map((option, optionIndex) => ({
      clientId: option.clientId || createClientId(),
      ...option,
      order: optionIndex,
    })),
  }));
};

export const mapFormToPayload = (
  values: CreateQuizFormValues,
): CreateQuizPayload => {
  const normalizedQuestions = normalizeQuestionOrders(values.questions);

  return {
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    questions: normalizedQuestions.map((question) => {
      const base = {
        type: question.type,
        prompt: question.prompt.trim(),
        order: question.order,
        required: question.required,
      };

      if (question.type === 'BOOLEAN') {
        return {
          ...base,
          type: 'BOOLEAN' as const,
          booleanAnswer: Boolean(question.booleanAnswer),
        };
      }

      if (question.type === 'INPUT') {
        return {
          ...base,
          type: 'INPUT' as const,
          inputAnswer: question.inputAnswer?.trim() || '',
        };
      }

      return {
        ...base,
        type: 'CHECKBOX' as const,
        options: (question.options || []).map((option, index) => ({
          label: option.label.trim(),
          isCorrect: option.isCorrect,
          order: index,
        })),
      };
    }),
  };
};
