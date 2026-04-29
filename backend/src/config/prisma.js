const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const env = require('./env');

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
};

const prisma = global.prisma || createPrismaClient();

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
