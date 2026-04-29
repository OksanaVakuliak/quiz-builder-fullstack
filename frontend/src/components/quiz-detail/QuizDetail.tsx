'use client';

import Link from 'next/link';
import { useQuizDetailQuery } from '@/services/api/quiz.query';
import { useQuizAttemptStore } from '@/store/quiz-attempt.store';
import { Question, Quiz } from '@/types/quiz.types';
import { AppLoader } from '@/components/ui/AppLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './QuizDetail.module.css';

interface QuizDetailProps {
  quizId: number;
  initialQuiz?: Quiz;
}

interface QuizAnswersSnapshot {
  booleanAnswers: Record<string, boolean>;
  inputAnswers: Record<string, string>;
  checkboxAnswers: Record<string, number[]>;
}

interface QuestionEvaluation {
  isAnswered: boolean;
  isCorrect: boolean;
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

const normalizeText = (value: string): string => value.trim().toLowerCase();

const toQuestionKey = (questionId: number): string => String(questionId);

const evaluateQuestion = (question: Question, answers: QuizAnswersSnapshot): QuestionEvaluation => {
  const questionKey = toQuestionKey(question.id);

  if (question.type === 'BOOLEAN') {
    const userAnswer = answers.booleanAnswers[questionKey];
    const expectedAnswer = question.booleanAnswer;
    const isAnswered = typeof userAnswer === 'boolean';

    return {
      isAnswered,
      isCorrect: isAnswered && typeof expectedAnswer === 'boolean' && userAnswer === expectedAnswer,
    };
  }

  if (question.type === 'INPUT') {
    const userAnswer = answers.inputAnswers[questionKey] ?? '';
    const expectedAnswer = question.inputAnswer ?? '';
    const isAnswered = userAnswer.trim().length > 0;

    return {
      isAnswered,
      isCorrect: isAnswered && normalizeText(userAnswer) === normalizeText(expectedAnswer),
    };
  }

  const selectedOptionIds = answers.checkboxAnswers[questionKey] ?? [];
  const selectedOptions = new Set(selectedOptionIds);
  const correctOptionIds = question.options
    .filter((option) => option.isCorrect)
    .map((option) => option.id);
  const isAnswered = selectedOptionIds.length > 0;

  return {
    isAnswered,
    isCorrect:
      isAnswered &&
      selectedOptionIds.length === correctOptionIds.length &&
      correctOptionIds.every((optionId) => selectedOptions.has(optionId)),
  };
};

const getBooleanLabel = (value: boolean | null): string => {
  if (typeof value !== 'boolean') {
    return 'Not provided';
  }

  return value ? 'True' : 'False';
};

export function QuizDetail({ quizId, initialQuiz }: QuizDetailProps) {
  const { data: quiz, isPending, isError, error } = useQuizDetailQuery(quizId, initialQuiz);
  const attempt = useQuizAttemptStore((state) => state.attemptsByQuizId[String(quizId)]);
  const setBooleanAnswer = useQuizAttemptStore((state) => state.setBooleanAnswer);
  const setInputAnswer = useQuizAttemptStore((state) => state.setInputAnswer);
  const toggleCheckboxOption = useQuizAttemptStore((state) => state.toggleCheckboxOption);
  const markQuizAsChecked = useQuizAttemptStore((state) => state.markQuizAsChecked);
  const resetQuizAttempt = useQuizAttemptStore((state) => state.resetQuizAttempt);

  if (isPending && initialQuiz === undefined) {
    return (
      <Card>
        <AppLoader compact title="Loading quiz details..." subtitle="Collecting questions" />
      </Card>
    );
  }

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to load quiz details.')
    : 'Quiz not found.';

  if (!quiz) {
    return (
      <Card>
        <p className={styles.error}>{errorMessage}</p>
        <Button asChild variant="secondary">
          <Link href="/quizzes">Back to quiz list</Link>
        </Button>
      </Card>
    );
  }

  const answers: QuizAnswersSnapshot = {
    booleanAnswers: attempt?.booleanAnswers ?? {},
    inputAnswers: attempt?.inputAnswers ?? {},
    checkboxAnswers: attempt?.checkboxAnswers ?? {},
  };
  const isChecked = attempt?.isChecked ?? false;

  const evaluationByQuestionId = quiz.questions.reduce<Record<string, QuestionEvaluation>>(
    (accumulator, question) => {
      accumulator[toQuestionKey(question.id)] = evaluateQuestion(question, answers);
      return accumulator;
    },
    {}
  );

  const correctAnswersCount = quiz.questions.reduce((total, question) => {
    const evaluation = evaluationByQuestionId[toQuestionKey(question.id)];
    return total + (evaluation?.isCorrect ? 1 : 0);
  }, 0);

  return (
    <div className={styles.wrapper}>
      <Card>
        <h1 className="pageTitle" style={{ margin: 0 }}>
          {quiz.title}
        </h1>
        {quiz.description ? <p className="pageSubtitle">{quiz.description}</p> : null}

        <div className={styles.actionsRow}>
          <Button type="button" onClick={() => markQuizAsChecked(quizId)}>
            Check answers
          </Button>
          <Button type="button" variant="secondary" onClick={() => resetQuizAttempt(quizId)}>
            Reset answers
          </Button>
          {isChecked ? (
            <p className={styles.score}>
              Score: {correctAnswersCount + '/' + quiz.questions.length}
            </p>
          ) : (
            <p className={styles.scoreHint}>Answer the questions and press Check answers.</p>
          )}
        </div>
      </Card>

      <div className={styles.questionsList}>
        {quiz.questions.map((question, index) => (
          <Card key={question.id} className={styles.questionCard}>
            <p className={styles.questionMeta}>
              Q{index + 1} • {question.type}
            </p>
            <p className={styles.prompt}>{question.prompt}</p>

            {question.type === 'BOOLEAN' ? (
              <div className={styles.choiceGroup}>
                <label className={styles.choiceItem}>
                  <input
                    type="radio"
                    name={`boolean-${question.id}`}
                    checked={answers.booleanAnswers[toQuestionKey(question.id)] === true}
                    onChange={() => setBooleanAnswer(quizId, question.id, true)}
                  />
                  <span>True</span>
                </label>
                <label className={styles.choiceItem}>
                  <input
                    type="radio"
                    name={`boolean-${question.id}`}
                    checked={answers.booleanAnswers[toQuestionKey(question.id)] === false}
                    onChange={() => setBooleanAnswer(quizId, question.id, false)}
                  />
                  <span>False</span>
                </label>
              </div>
            ) : null}

            {question.type === 'INPUT' ? (
              <input
                type="text"
                className={styles.inputControl}
                value={answers.inputAnswers[toQuestionKey(question.id)] ?? ''}
                onChange={(event) => setInputAnswer(quizId, question.id, event.target.value)}
                placeholder="Type your answer"
              />
            ) : null}

            {question.type === 'CHECKBOX' ? (
              <ul className={styles.optionList}>
                {question.options.map((option) => (
                  <li
                    key={option.id}
                    className={`${styles.optionItem} ${
                      isChecked
                        ? option.isCorrect
                          ? styles.optionCorrect
                          : (answers.checkboxAnswers[toQuestionKey(question.id)] ?? []).includes(
                                option.id
                              )
                            ? styles.optionIncorrect
                            : ''
                        : ''
                    }`}
                  >
                    <label className={styles.optionLabel}>
                      <input
                        type="checkbox"
                        checked={(
                          answers.checkboxAnswers[toQuestionKey(question.id)] ?? []
                        ).includes(option.id)}
                        onChange={() => toggleCheckboxOption(quizId, question.id, option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                    {isChecked && option.isCorrect ? (
                      <span className={styles.correctTag}>Correct</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {isChecked ? (
              <p
                className={
                  evaluationByQuestionId[toQuestionKey(question.id)]?.isCorrect
                    ? styles.resultCorrect
                    : styles.resultIncorrect
                }
              >
                {evaluationByQuestionId[toQuestionKey(question.id)]?.isCorrect
                  ? 'Your answer is correct.'
                  : evaluationByQuestionId[toQuestionKey(question.id)]?.isAnswered
                    ? 'Your answer is incorrect.'
                    : 'No answer provided.'}
              </p>
            ) : null}

            {isChecked && question.type === 'BOOLEAN' ? (
              <p className={styles.answerReveal}>
                Correct answer: {getBooleanLabel(question.booleanAnswer)}
              </p>
            ) : null}

            {isChecked && question.type === 'INPUT' ? (
              <p className={styles.answerReveal}>
                Correct answer: {question.inputAnswer ?? 'Not provided'}
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
