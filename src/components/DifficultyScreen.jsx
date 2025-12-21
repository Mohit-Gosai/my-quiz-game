export default function DifficultyScreen({ onSelect }) {
    return (
        <section className="difficulty-section">
            <h2>Select Difficulty</h2>
            <div className="difficulty-buttons">
                {["easy", "medium", "hard"].map(level => (
                    <button
                        key={level}
                        className={`difficulty-btn ${level}`}
                        onClick={() => onSelect(level)}
                    >
                        {level.toUpperCase()}
                    </button>
                ))}
            </div>
        </section>
    );
}
