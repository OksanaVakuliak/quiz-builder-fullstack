import { z } from 'zod';

const optionSchema = z.object({
  label: z.string().trim().min(1, 'Option label is required'),
  isCorrect: z.boolean(),
  order: z.number().int().nonnegative(),
});

const questionSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    prompt: z.string().trim().min(1, 'Question prompt is required'),
    order: z.number().int().nonnegative(),
    required: z.boolean(),
    booleanAnswer: z.boolean().optional(),
    inputAnswer: z.string().optional(),
    options: z.array(optionSchema).optional(),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'BOOLEAN' && typeof question.booleanAnswer !== 'boolean') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Choose True or False answer',
        path: ['booleanAnswer'],
      });
    }

    if (question.type === 'INPUT' && (!question.inputAnswer || !question.inputAnswer.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Input answer is required',
        path: ['inputAnswer'],
      });
    }

    if (question.type === 'CHECKBOX') {
      if (!question.options || question.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Add at least two options',
          path: ['options'],
        });
        return;
      }

      if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mark at least one option as correct',
          path: ['options'],
        });
      }
    }
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().max(500).optional(),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});
