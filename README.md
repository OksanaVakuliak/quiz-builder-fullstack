# Quiz Builder Full-Stack

Quiz Builder is a full-stack application where users can create quizzes with three question types:

- `BOOLEAN` (True/False)
- `INPUT` (short text answer)
- `CHECKBOX` (multiple options with one or more correct answers)

## Tech Stack

- Backend: Node.js, Express.js, Prisma, PostgreSQL
- Frontend: Next.js 16 (App Router), TypeScript
- Forms and validation: React Hook Form + Zod
- API client: Axios
- Styling: CSS Modules

## Project Structure

```
quiz-builder-fullstack/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   └── src/
└── README.md
```

## Prerequisites

- Node.js `>=20.19.0` (recommended: 22.12+ LTS)
- PostgreSQL running locally

## 1. Backend Setup

```bash
cd backend
npm install
```

Create backend env file:

```bash
cp .env.example .env
```

Run Prisma migration and generate client:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

Seed sample quiz:

```bash
npm run prisma:seed
```

Run backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:4000` by default.

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Create frontend env file:

```bash
cp .env.local.example .env.local
```

Run frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

## API Endpoints

- `POST /api/quizzes` - create quiz
- `GET /api/quizzes` - list quiz summaries
- `GET /api/quizzes/:id` - get full quiz details
- `DELETE /api/quizzes/:id` - delete quiz

## Sample Create Quiz Request

```json
{
  "title": "Frontend Basics",
  "description": "Demo quiz",
  "questions": [
    {
      "type": "BOOLEAN",
      "prompt": "React is a framework.",
      "order": 0,
      "required": true,
      "booleanAnswer": false
    },
    {
      "type": "INPUT",
      "prompt": "What hook is used for local state?",
      "order": 1,
      "required": true,
      "inputAnswer": "useState"
    },
    {
      "type": "CHECKBOX",
      "prompt": "Select JavaScript runtimes.",
      "order": 2,
      "required": true,
      "options": [
        { "label": "Node.js", "isCorrect": true, "order": 0 },
        { "label": "Deno", "isCorrect": true, "order": 1 },
        { "label": "PostgreSQL", "isCorrect": false, "order": 2 }
      ]
    }
  ]
}
```

## Lint and Format

Backend:

```bash
cd backend
npm run lint
npm run format:check
```

Frontend:

```bash
cd frontend
npm run lint
npm run typecheck
npm run format:check
```

## Deploy Backend to Render

The repository includes Render Blueprint config in [render.yaml](render.yaml).

If you deploy from Render Dashboard manually, use these settings for backend:

- Root Directory: `backend`
- Build Command: `npm ci && npm run prisma:generate`
- Start Command: `npm run start`
- Health Check Path: `/api/health`

Required environment variables on Render:

- `DATABASE_URL`
- `CORS_ORIGIN` (your frontend URL)
- `NODE_ENV=production`

Important: Build Command set to only `npm` will always fail, because it only prints npm help and exits with non-zero status.
