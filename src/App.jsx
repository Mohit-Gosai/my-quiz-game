import React, { useEffect, useState } from 'react'

function App() {
  {/* State Variables */}
  const [isStarted, setIsStarted] = useState(false);
  const [showDifficultyScreen, setShowDifficultyScreen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);

  {/* Timer effect */}
  useEffect(() => {
    if (!isStarted || answered || !timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStarted, answered, timeLeft]);

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setAnswered(true);
  }

  {/* Fetch questions from questions.json on component mount */}
  useEffect(() => {
    fetch('/questions.json')
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  {/* Function to start the quiz by selecting 5 random questions based on difficulty */}
  const startQuiz = (selectedDifficulty) => {
    if (!questions || questions.length === 0) return;
    
    {/* Filter questions by difficulty */}
    const filtered = questions.filter(q => q.difficulty === selectedDifficulty);
    
    const picked = [];
    const used = new Set();
    const numQuestions = 5;
    
    while (picked.length < numQuestions && picked.length < filtered.length) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      if (!used.has(randomIndex)) {
        used.add(randomIndex);
        picked.push(filtered[randomIndex]);
      }
    }
    
    setSelectedQuestions(picked);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setDifficulty(selectedDifficulty);
    setTimeLeft(numQuestions * 15);
    setTotalTime(numQuestions * 15);
    setShowDifficultyScreen(false);
    setIsStarted(true);
  }

  const handleSelectDifficulty = () => {
    setShowDifficultyScreen(true);
  }

  {/* Handle answer selection */}
  const handleAnswerClick = (optionIndex) => {
    if (answered) return;
    
    setSelectedAnswer(optionIndex);
    const current = selectedQuestions[currentIndex];
    
    {/* Check if the selected answer is correct */}
    if (optionIndex === current.correct) {
      setScore((prevScore) => prevScore + 20);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setAnswered(true);
  }

  const handleNext = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Quiz finished
      setShowResults(true);
    }
  }

  const tryAgain = () => {
    setIsStarted(false);
    setShowDifficultyScreen(false);
    setSelectedQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResults(false);
    setDifficulty(null);
    setTimeLeft(0);
  }

  const current = selectedQuestions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / selectedQuestions.length) * 100;
  const timePercentage = (timeLeft / totalTime) * 100;
  
  return (
    <>
      <header>
        <h1>🎯 Quiz Master</h1>
        <p>Challenge yourself with questions of varying difficulty!</p>
      </header>
      <main className='container'>
        {showDifficultyScreen && !isStarted ? (
          <section className="difficulty-section">
            <h2>Select Difficulty Level</h2>
            <p>Choose your challenge and start the quiz!</p>
            <div className="difficulty-buttons">
              <button className="difficulty-btn easy" onClick={() => startQuiz('easy')}>
                <span className="difficulty-icon">⭐</span>
                Easy
              </button>
              <button className="difficulty-btn medium" onClick={() => startQuiz('medium')}>
                <span className="difficulty-icon">⭐⭐</span>
                Medium
              </button>
              <button className="difficulty-btn hard" onClick={() => startQuiz('hard')}>
                <span className="difficulty-icon">⭐⭐⭐</span>
                Hard
              </button>
            </div>
          </section>
        ) : isStarted && current ? (
          <section className="quiz-section">
            <div className="quiz-header">
              <div className="timer-container">
                <div className="timer" style={{ borderColor: timePercentage < 20 ? '#f44336' : '#4CAF50' }}>
                  <span className="timer-value">{timeLeft}s</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="quiz-info">
                <span className="question-counter">Q{currentIndex + 1}/{selectedQuestions.length}</span>
                <span className="streak-counter">🔥 Streak: {streak}</span>
              </div>
            </div>
            
            <div className="question-container">
              <div className="question">{current.question}</div>
              <div className="score-board">Score: {score} / 100</div>
            </div>
            
            <div className="answers">
              <ul className="options">
                {current.options && current.options.map((option, index) => (
                  <li 
                    key={index} 
                    className={`option ${selectedAnswer === index ? (index === current.correct ? 'correct' : 'incorrect') : ''} ${answered && index === current.correct ? 'correct' : ''}`}
                    onClick={() => handleAnswerClick(index)}
                    style={{ cursor: answered ? 'not-allowed' : 'pointer', opacity: answered ? 0.8 : 1 }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <button 
                className="next-button" 
                onClick={handleNext}
                disabled={!answered}
                style={{ opacity: answered ? 1 : 0.5, cursor: answered ? 'pointer' : 'not-allowed' }}
              >
                {currentIndex === selectedQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </section>
        ) : !showResults && !showDifficultyScreen ? (
          <section className="start-section">
            <h2>Ready to Test Your Knowledge?</h2>
            <p>Select a difficulty level and take the quiz!</p>
            <button onClick={handleSelectDifficulty} className='next-button start-btn'>Start Quiz</button>
          </section>
        ) : null}

        {/* Results Modal/Popover */}
        {showResults && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Quiz Completed! 🎉</h2>
              <div className="results-info">
                <p className="final-score">Your Score: <span>{score}</span> / 100</p>
                <p className="difficulty-badge">Difficulty: <span className={difficulty}>{difficulty?.toUpperCase()}</span></p>
                <p className="result-message">
                  {score === 100 ? '🏆 Perfect! Incredible performance!' : score >= 80 ? '🥇 Excellent! Great job!' : score >= 60 ? '🥈 Good effort! Keep practicing!' : '🥉 Keep trying! You\'ll improve!'}
                </p>
              </div>
              <button onClick={tryAgain} className="try-again-button">Try Another Quiz</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default App