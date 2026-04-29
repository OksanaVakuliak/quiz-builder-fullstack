const { z } = require('zod');

const questionTypeEnum = z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']);

const optionSchema = z.object({
  label: z.string().trim().min(1, 'Option label is required'),
  isCorrect: z.boolean(),
  order: z.number().int().nonnegative().optional(),
});

const questionSchema = z
  .object({
    type: questionTypeEnum,
    prompt: z.string().trim().min(1, 'Question prompt is required'),
    order: z.number().int().nonnegative().optional(),
    required: z.boolean().optional().default(true),
    booleanAnswer: z.boolean().optional(),
    inputAnswer: z.string().trim().min(1).optional(),
    options: z.array(optionSchema).optional(),
  })
  .superRefine((question, ctx) => {
    if (
      question.type === 'BOOLEAN' &&
      typeof question.booleanAnswer !== 'boolean'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'BOOLEAN questions must include booleanAnswer',
        path: ['booleanAnswer'],
      });
    }

    if (question.type === 'INPUT' && !question.inputAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'INPUT questions must include inputAnswer',
        path: ['inputAnswer'],
      });
    }

    if (question.type === 'CHECKBOX') {
      if (!question.options || question.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CHECKBOX questions must include at least 2 options',
          path: ['options'],
        });
        return;
      }

      if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'CHECKBOX questions must include at least one correct option',
          path: ['options'],
        });
      }
    }
  });

const questionsSchema = z
  .unknown()
  .refine(Array.isArray, {
    message: 'questions must be an array of question objects',
  })
  .pipe(
    z
      .array(questionSchema)
      .min(1, 'questions must contain at least one question'),
  );

const createQuizBodySchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional(),
  questions: questionsSchema,
});

const quizIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = {
  createQuizBodySchema,
  quizIdParamSchema,
};
