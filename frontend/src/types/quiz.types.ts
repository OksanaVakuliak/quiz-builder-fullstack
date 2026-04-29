export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface CheckboxOption {
  id: number;
  label: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: number;
  type: QuestionType;
  prompt: string;
  order: number;
  required: boolean;
  booleanAnswer: boolean | null;
  inputAnswer: string | null;
  options: CheckboxOption[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface CheckboxOptionForm {
  clientId?: string;
  label: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionForm {
  clientId?: string;
  type: QuestionType;
  prompt: string;
  order: number;
  required: boolean;
  booleanAnswer?: boolean;
  inputAnswer?: string;
  options?: CheckboxOptionForm[];
}

export interface CreateQuizFormValues {
  title: string;
  description?: string;
  questions: QuestionForm[];
}

interface CreateQuestionPayloadBase {
  type: QuestionType;
  prompt: string;
  order: number;
  required: boolean;
}

export interface CreateBooleanQuestionPayload extends CreateQuestionPayloadBase {
  type: 'BOOLEAN';
  booleanAnswer: boolean;
}

export interface CreateInputQuestionPayload extends CreateQuestionPayloadBase {
  type: 'INPUT';
  inputAnswer: string;
}

export interface CreateCheckboxQuestionPayload extends CreateQuestionPayloadBase {
  type: 'CHECKBOX';
  options: CheckboxOptionForm[];
}

export type CreateQuestionPayload =
  | CreateBooleanQuestionPayload
  | CreateInputQuestionPayload
  | CreateCheckboxQuestionPayload;

export interface CreateQuizPayload {
  title: string;
  description?: string;
  questions: CreateQuestionPayload[];
}
