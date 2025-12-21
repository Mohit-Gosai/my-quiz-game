export default function QuestionCard({ question, score }) {
  return (
    <div className="question-container">
      <div className="question">{question}</div>
      <div className="score-board">Score: {score} / 100</div>
    </div>
  );
}