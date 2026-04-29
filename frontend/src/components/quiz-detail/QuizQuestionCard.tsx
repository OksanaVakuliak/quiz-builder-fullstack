import {
  getBooleanLabel,
  QuestionEvaluation,
  QuizAnswersSnapshot,
  toQuestionKey,
} from '@/lib/quiz-evaluation';
import { Question } from '@/types/quiz.types';
import { Card } from '@/components/ui/Card';
import { QuizAttemptActions } from './useQuizAttemptController';
import styles from './QuizDetail.module.css';

interface QuizQuestionCardProps {
  quizId: number;
  question: Question;
  index: number;
  isChecked: boolean;
  answers: QuizAnswersSnapshot;
  evaluation?: QuestionEvaluation;
  actions: Pick<QuizAttemptActions, 'setBooleanAnswer' | 'setInputAnswer' | 'toggleCheckboxOption'>;
}

export function QuizQuestionCard({
  quizId,
  question,
  index,
  isChecked,
  answers,
  evaluation,
  actions,
}: QuizQuestionCardProps) {
  const questionKey = toQuestionKey(question.id);
  const selectedOptionIds = answers.checkboxAnswers[questionKey] ?? [];
  const questionTitleId = `quiz-${quizId}-question-${question.id}-title`;
  const resultId = `quiz-${quizId}-question-${question.id}-result`;

  return (
    <Card className={styles.questionCard} role="listitem" aria-labelledby={questionTitleId}>
      <p className={styles.questionMeta}>
        Q{index + 1} • {question.type}
      </p>
      <p id={questionTitleId} className={styles.prompt}>
        {question.prompt}
      </p>

      {question.type === 'BOOLEAN' ? (
        <fieldset className={styles.choiceGroup}>
          <legend className="srOnly">Select true or false</legend>
          <label
            className={styles.choiceItem}
            htmlFor={`quiz-${quizId}-question-${question.id}-boolean-true`}
          >
            <input
              id={`quiz-${quizId}-question-${question.id}-boolean-true`}
              type="radio"
              name={`boolean-${question.id}`}
              checked={answers.booleanAnswers[questionKey] === true}
              aria-describedby={isChecked ? resultId : undefined}
              onChange={() => actions.setBooleanAnswer(quizId, question.id, true)}
            />
            <span>True</span>
          </label>
          <label
            className={styles.choiceItem}
            htmlFor={`quiz-${quizId}-question-${question.id}-boolean-false`}
          >
            <input
              id={`quiz-${quizId}-question-${question.id}-boolean-false`}
              type="radio"
              name={`boolean-${question.id}`}
              checked={answers.booleanAnswers[questionKey] === false}
              aria-describedby={isChecked ? resultId : undefined}
              onChange={() => actions.setBooleanAnswer(quizId, question.id, false)}
            />
            <span>False</span>
          </label>
        </fieldset>
      ) : null}

      {question.type === 'INPUT' ? (
        <>
          <label htmlFor={`quiz-${quizId}-question-${question.id}-input`} className="srOnly">
            Type your answer
          </label>
          <input
            id={`quiz-${quizId}-question-${question.id}-input`}
            type="text"
            className={styles.inputControl}
            value={answers.inputAnswers[questionKey] ?? ''}
            aria-describedby={isChecked ? resultId : undefined}
            onChange={(event) => actions.setInputAnswer(quizId, question.id, event.target.value)}
            placeholder="Type your answer"
          />
        </>
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
                    : selectedOptionIds.includes(option.id)
                      ? styles.optionIncorrect
                      : ''
                  : ''
              }`}
            >
              <label
                className={styles.optionLabel}
                htmlFor={`quiz-${quizId}-question-${question.id}-option-${option.id}`}
              >
                <input
                  id={`quiz-${quizId}-question-${question.id}-option-${option.id}`}
                  type="checkbox"
                  checked={selectedOptionIds.includes(option.id)}
                  aria-describedby={isChecked ? resultId : undefined}
                  onChange={() => actions.toggleCheckboxOption(quizId, question.id, option.id)}
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
          id={resultId}
          className={evaluation?.isCorrect ? styles.resultCorrect : styles.resultIncorrect}
          role="status"
          aria-live="polite"
        >
          {evaluation?.isCorrect
            ? 'Your answer is correct.'
            : evaluation?.isAnswered
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
  );
}
