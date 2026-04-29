const dotenv = require('dotenv');
const { z } = require('zod');
const logger = require('./logger');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.logger.error(
    { errors: parsed.error.flatten().fieldErrors },
    'Invalid environment variables',
  );
  process.exit(1);
}

module.exports = parsed.data;
