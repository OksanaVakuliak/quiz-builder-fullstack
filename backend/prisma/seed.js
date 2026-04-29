require('dotenv/config');

const logger = require('../src/config/logger');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient, QuestionType } = require('@prisma/client');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const existingQuiz = await prisma.quiz.findFirst({
    where: {
      title: 'General Knowledge Demo Quiz',
    },
  });

  if (existingQuiz) {
    logger.logger.info('Seed skipped: demo quiz already exists.');
    return;
  }

  await prisma.quiz.create({
    data: {
      title: 'General Knowledge Demo Quiz',
      description:
        'A seeded sample quiz that demonstrates all supported question types.',
      questions: {
        create: [
          {
            type: QuestionType.BOOLEAN,
            prompt: 'The Earth revolves around the Sun.',
            order: 0,
            required: true,
            booleanAnswer: true,
          },
          {
            type: QuestionType.INPUT,
            prompt: 'What is the capital city of France?',
            order: 1,
            required: true,
            inputAnswer: 'Paris',
          },
          {
            type: QuestionType.CHECKBOX,
            prompt: 'Select all prime numbers.',
            order: 2,
            required: true,
            options: {
              create: [
                { label: '2', isCorrect: true, order: 0 },
                { label: '3', isCorrect: true, order: 1 },
                { label: '4', isCorrect: false, order: 2 },
                { label: '9', isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  logger.logger.info('Seed complete: demo quiz created.');
}

main()
  .then(
    () => undefined,
    (error) => {
      logger.logger.error({ err: error }, 'Seed failed');
      process.exit(1);
    },
  )
  .finally(async () => {
    await prisma.$disconnect();
  });
