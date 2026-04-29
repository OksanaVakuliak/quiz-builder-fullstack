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

  return (
    <Card className={styles.questionCard}>
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
              checked={answers.booleanAnswers[questionKey] === true}
              onChange={() => actions.setBooleanAnswer(quizId, question.id, true)}
            />
            <span>True</span>
          </label>
          <label className={styles.choiceItem}>
            <input
              type="radio"
              name={`boolean-${question.id}`}
              checked={answers.booleanAnswers[questionKey] === false}
              onChange={() => actions.setBooleanAnswer(quizId, question.id, false)}
            />
            <span>False</span>
          </label>
        </div>
      ) : null}

      {question.type === 'INPUT' ? (
        <input
          type="text"
          className={styles.inputControl}
          value={answers.inputAnswers[questionKey] ?? ''}
          onChange={(event) => actions.setInputAnswer(quizId, question.id, event.target.value)}
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
                    : selectedOptionIds.includes(option.id)
                      ? styles.optionIncorrect
                      : ''
                  : ''
              }`}
            >
              <label className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedOptionIds.includes(option.id)}
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
        <p className={evaluation?.isCorrect ? styles.resultCorrect : styles.resultIncorrect}>
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
