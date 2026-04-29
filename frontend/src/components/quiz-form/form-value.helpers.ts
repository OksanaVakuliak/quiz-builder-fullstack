import { FieldPath, FieldPathValue, UseFormSetValue } from 'react-hook-form';
import { CheckboxOptionForm, CreateQuizFormValues } from '@/types/quiz.types';

const updateFieldConfig = {
  shouldDirty: true,
  shouldValidate: true,
} as const;

export const setValidatedFormValue = <TFieldName extends FieldPath<CreateQuizFormValues>>(
  setValue: UseFormSetValue<CreateQuizFormValues>,
  fieldName: TFieldName,
  value: FieldPathValue<CreateQuizFormValues, TFieldName>
): void => {
  setValue(fieldName, value, updateFieldConfig);
};

export const normalizeOptionOrders = (options: CheckboxOptionForm[]): CheckboxOptionForm[] => {
  return options.map((option, optionIndex) => ({
    ...option,
    order: optionIndex,
  }));
};
