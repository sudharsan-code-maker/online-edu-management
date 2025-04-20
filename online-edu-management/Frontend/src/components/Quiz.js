import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_quiz_data/');
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswerChange = (event) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuiz] = { question: quizzes[currentQuiz].question, selectedAnswer: event.target.id };
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = async () => {
    if (selectedAnswers[currentQuiz] && selectedAnswers[currentQuiz].selectedAnswer) {
      if (currentQuiz + 1 < quizzes.length) {
        setCurrentQuiz(currentQuiz + 1);
      } else {
        try {
          const formattedAnswers = selectedAnswers.map((answer) => ({
            ...answer,
            selectedAnswer: answer.selectedAnswer.toUpperCase()
          }));

          const response = await axios.post('http://localhost:8000/api/check_quiz_answers/', { answers: formattedAnswers });
          setScore(response.data.correct_count);
          setIsQuizCompleted(true);
        } catch (error) {
          console.error('Error checking answers:', error);
        }
      }
    }
  };

  if (quizzes.length === 0) {
    return <div>Loading...</div>;
  }

  if (isQuizCompleted) {
    return (
      <div className="quiz-container mx-auto my-8 p-8 bg-gray-100 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold">You answered {score}/{quizzes.length} questions correctly</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container mx-auto my-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="quiz-header">
        <h2 className="text-2xl font-bold mb-4">{quizzes[currentQuiz].question}</h2>
        <ul className="space-y-4">
          {['a', 'b', 'c', 'd'].map((option) => (
            <li key={option}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`answer-${currentQuiz}`}
                  id={option}
                  className="mr-2"
                  onChange={handleAnswerChange}
                  checked={selectedAnswers[currentQuiz] && selectedAnswers[currentQuiz].selectedAnswer === option}
                />
                {quizzes[currentQuiz][option]}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        {currentQuiz + 1 < quizzes.length ? 'Next' : 'Submit'}
      </button>
    </div>
  );
};

export default Quiz;
