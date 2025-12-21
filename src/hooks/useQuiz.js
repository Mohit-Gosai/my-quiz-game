import { useEffect, useState } from "react";

export function useQuiz() {
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

    // Fetch questions
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}questions.json`)
            .then(res => res.json())
            .then(setQuestions)
            .catch(console.error);
    }, []);

    // Timer
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
    };

    const startQuiz = (level) => {
        const filtered = questions.filter(q => q.difficulty === level);
        const picked = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);

        setSelectedQuestions(picked);
        setDifficulty(level);
        setIsStarted(true);
        setShowDifficultyScreen(false);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setTimeLeft(picked.length * 15);
        setTotalTime(picked.length * 15);
    };

    const selectAnswer = (index) => {
        if (answered) return;
        setSelectedAnswer(index);

        if (index === selectedQuestions[currentIndex].correct) {
            setScore(s => s + 20);
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
        setAnswered(true);
    };

    const nextQuestion = () => {
        if (currentIndex < selectedQuestions.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedAnswer(null);
            setAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setIsStarted(false);
        setShowDifficultyScreen(false);
        setShowResults(false);
    };

    return {
        state: {
            isStarted,
            showDifficultyScreen,
            selectedQuestions,
            currentIndex,
            score,
            selectedAnswer,
            answered,
            showResults,
            difficulty,
            timeLeft,
            totalTime,
            streak
        },
        actions: {
            setShowDifficultyScreen,
            startQuiz,
            selectAnswer,
            nextQuestion,
            resetQuiz
        }
    };
}
