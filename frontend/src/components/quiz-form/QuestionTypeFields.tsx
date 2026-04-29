import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import { CreateQuizFormValues, QuestionForm } from '@/types/quiz.types';
import { QuestionBooleanFields } from './QuestionBooleanFields';
import { QuestionCheckboxFields } from './QuestionCheckboxFields';
import { QuestionInputFields } from './QuestionInputFields';

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
      <QuestionBooleanFields
        index={index}
        question={question}
        setValue={setValue}
        errorMessage={questionErrors?.booleanAnswer?.message as string | undefined}
      />
    );
  }

  if (question.type === 'INPUT') {
    return (
      <QuestionInputFields
        index={index}
        question={question}
        setValue={setValue}
        errorMessage={questionErrors?.inputAnswer?.message as string | undefined}
      />
    );
  }

  return (
    <QuestionCheckboxFields
      index={index}
      question={question}
      setValue={setValue}
      errorMessage={questionErrors?.options?.message as string | undefined}
    />
  );
}
