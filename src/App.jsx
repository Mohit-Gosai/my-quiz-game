import { useQuiz } from "./hooks/useQuiz";
import StartScreen from "./components/StartScreen";
import DifficultyScreen from "./components/DifficultyScreen";
import QuestionCard from "./components/QuestionCard";
import OptionsList from "./components/OptionsList";
import ResultModal from "./components/ResultModal";

function App() {
  const { state, actions } = useQuiz();
  const current = state.selectedQuestions[state.currentIndex];

  return (
    <>
      <header>
        <h1>🎯 Quiz Master</h1>
      </header>

      <main className="container">
        {!state.isStarted && !state.showResults && !state.showDifficultyScreen && (
          <StartScreen onStart={() => actions.setShowDifficultyScreen(true)} />
        )}

        {state.showDifficultyScreen && (
          <DifficultyScreen onSelect={actions.startQuiz} />
        )}

        {state.isStarted && current && (
          <>
            <QuestionCard
              question={current.question}
              score={state.score}
            />
            <OptionsList
              options={current.options}
              correct={current.correct}
              selected={state.selectedAnswer}
              answered={state.answered}
              onSelect={actions.selectAnswer}
            />
            <button
              className="next-button"
              onClick={actions.nextQuestion}
              disabled={!state.answered}
            >
              Next
            </button>
          </>
        )}

        {state.showResults && (
          <ResultModal
            score={state.score}
            difficulty={state.difficulty}
            onRetry={actions.resetQuiz}
          />
        )}
      </main>
    </>
  );
}

export default App;
