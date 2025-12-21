export default function StartScreen({ onStart }) {
    return (
        <section className="start-section">
            <h2>Ready to Test Your Knowledge?</h2>
            <p>Select a difficulty level and take the quiz!</p>
            <button onClick={onStart} className="next-button start-btn">
                Start Quiz
            </button>
        </section>
    );
}
