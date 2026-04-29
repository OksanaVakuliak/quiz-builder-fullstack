# Full-Stack JS Engineer Test Assessment - Quiz Builder

## Overview

Quiz Builder is a full-stack web application where users can:

- create quizzes with multiple question types;
- view all created quizzes;
- open a single quiz with full question details;
- delete quizzes.

The project is organized into separate backend and frontend applications.

## Objective Coverage

Implemented requirements from the assignment:

- Quiz creation flow with dynamic question management.
- Supported question types:
  - BOOLEAN (True/False)
  - INPUT (short text)
  - CHECKBOX (multiple options, one or more correct)
- Quiz list dashboard with title + question count.
- Quiz details page with all questions.
- Quiz deletion.
- ESLint and Prettier configured for both apps.
- Environment-based config via .env files.
- Seed script with sample quizzes for testing.

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Zod validation

### Frontend

- Next.js 16
- React 19
- TypeScript
- React Hook Form + Zod
- React Query
- Zustand
- CSS Modules

## Project Structure

```text
quiz-builder-fullstack/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── config/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── store/
│   │   └── types/
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20.19+
- npm
- PostgreSQL database

### Backend environment

Copy example:

```bash
cd backend
cp .env.example .env
```

Example variables:

- DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public
- PORT=4000
- CORS_ORIGIN=http://localhost:3000
- NODE_ENV=development

### Frontend environment

Copy example:

```bash
cd frontend
cp .env.example .env
```

Example variables:

- NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
- API_BASE_URL=http://localhost:4000/api

## Local Setup and Run

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Setup database

If your database does not exist yet, create it first (example name: quiz_builder), then run migrations.

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 3. Start backend and frontend

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

## API Endpoints

Backend routes are mounted under /api.

1. POST /api/quizzes
   - Create a new quiz
2. GET /api/quizzes
   - Get all quizzes (summary: id, title, questionCount, createdAt)
3. GET /api/quizzes/:id
   - Get full quiz details with ordered questions and options
4. DELETE /api/quizzes/:id
   - Delete quiz

### Example create payload

```json
{
  "title": "Frontend Basics",
  "description": "Simple demo quiz",
  "questions": [
    {
      "type": "BOOLEAN",
      "prompt": "HTML is a programming language.",
      "order": 0,
      "required": true,
      "booleanAnswer": false
    },
    {
      "type": "INPUT",
      "prompt": "Which CSS property changes text color?",
      "order": 1,
      "required": true,
      "inputAnswer": "color"
    },
    {
      "type": "CHECKBOX",
      "prompt": "Select JavaScript primitive types.",
      "order": 2,
      "required": true,
      "options": [
        { "label": "string", "isCorrect": true, "order": 0 },
        { "label": "number", "isCorrect": true, "order": 1 },
        { "label": "array", "isCorrect": false, "order": 2 }
      ]
    }
  ]
}
```

## Frontend Pages

1. /create
   - Create quiz form with dynamic add/remove questions
2. /quizzes
   - Quiz list with delete action
3. /quizzes/:id
   - Quiz details page with full structure rendering

Additional UX features:

- mobile-first responsive styles;
- accessibility improvements (skip link, focus-visible, ARIA labels/alerts);
- optimistic list updates and toast feedback for delete/create flows;
- optional local answer-checking mode on quiz detail page.

## Code Quality

### Backend

```bash
cd backend
npm run lint
npm run format:check
```

### Frontend

```bash
cd frontend
npm run typecheck
npm run lint
npm run format:check
```

## Deliverables Checklist

- backend and frontend directories in one repository
- working local full-stack app (API + UI)
- seed script with sample quizzes
- modular structure with validation and typed frontend contracts
