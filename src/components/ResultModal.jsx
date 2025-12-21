export default function ResultModal({ score, difficulty, onRetry }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Quiz Completed 🎉</h2>
                <p>Your Score: {score}</p>
                <p>Difficulty: {difficulty}</p>
                <button onClick={onRetry} className="try-again-button">
                    Try Again
                </button>
            </div>
        </div>
    );
}
