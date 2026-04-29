import assert from 'node:assert/strict';
import test from 'node:test';
import { Question } from '@/types/quiz.types';
import {
  countCorrectAnswers,
  evaluateQuestion,
  evaluateQuiz,
  QuizAnswersSnapshot,
} from './quiz-evaluation';

const booleanQuestion: Question = {
  id: 1,
  type: 'BOOLEAN',
  prompt: 'Is React a library?',
  order: 0,
  required: true,
  booleanAnswer: true,
  inputAnswer: null,
  options: [],
};

const inputQuestion: Question = {
  id: 2,
  type: 'INPUT',
  prompt: 'Type JavaScript runtime',
  order: 1,
  required: true,
  booleanAnswer: null,
  inputAnswer: 'Node.js',
  options: [],
};

const checkboxQuestion: Question = {
  id: 3,
  type: 'CHECKBOX',
  prompt: 'Select valid HTTP methods',
  order: 2,
  required: true,
  booleanAnswer: null,
  inputAnswer: null,
  options: [
    { id: 30, label: 'GET', isCorrect: true, order: 0 },
    { id: 31, label: 'POST', isCorrect: true, order: 1 },
    { id: 32, label: 'RANDOM', isCorrect: false, order: 2 },
  ],
};

test('evaluateQuestion returns correct evaluation for BOOLEAN', () => {
  const answers: QuizAnswersSnapshot = {
    booleanAnswers: { '1': true },
    inputAnswers: {},
    checkboxAnswers: {},
  };

  const evaluation = evaluateQuestion(booleanQuestion, answers);

  assert.equal(evaluation.isAnswered, true);
  assert.equal(evaluation.isCorrect, true);
});

test('evaluateQuestion ignores input case and spaces', () => {
  const answers: QuizAnswersSnapshot = {
    booleanAnswers: {},
    inputAnswers: { '2': '  node.JS ' },
    checkboxAnswers: {},
  };

  const evaluation = evaluateQuestion(inputQuestion, answers);

  assert.equal(evaluation.isAnswered, true);
  assert.equal(evaluation.isCorrect, true);
});

test('evaluateQuestion validates exact set for CHECKBOX', () => {
  const answers: QuizAnswersSnapshot = {
    booleanAnswers: {},
    inputAnswers: {},
    checkboxAnswers: { '3': [30, 31] },
  };

  const evaluation = evaluateQuestion(checkboxQuestion, answers);

  assert.equal(evaluation.isAnswered, true);
  assert.equal(evaluation.isCorrect, true);
});

test('evaluateQuiz and countCorrectAnswers aggregate result correctly', () => {
  const questions = [booleanQuestion, inputQuestion, checkboxQuestion];
  const answers: QuizAnswersSnapshot = {
    booleanAnswers: { '1': true },
    inputAnswers: { '2': 'node.js' },
    checkboxAnswers: { '3': [30] },
  };

  const evaluationByQuestionId = evaluateQuiz(questions, answers);
  const correctCount = countCorrectAnswers(questions, evaluationByQuestionId);

  assert.equal(correctCount, 2);
  assert.equal(evaluationByQuestionId['3']?.isCorrect, false);
});
