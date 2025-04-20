import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeView = () => {
  const [gradeData, setGradeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/grade_tracking/');
        setGradeData(response.data);
      } catch (error) {
        setError('Error fetching grade data');
      }
    };

    fetchGradeData();
  }, []);

  const renderStars = (correctCount) => {
    const stars = [];
    const totalStars = 5;

    // Render correct answers in yellow and incorrect in red
    for (let i = 0; i < totalStars; i++) {
      if (i < correctCount) {
        stars.push(<span key={i} className="text-yellow-500 text-5xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-red-500 text-5xl">★</span>);
      }
    }

    return (
      <div className="flex">
        {stars}
      </div>
    );
  };

  return (
    <div className="grade-view-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* <h1 className="text-3xl font-extrabold mb-8">Grade View</h1> */}
      {error && <p className="error text-red-500">{error}</p>}
      {gradeData ? (
        <div className="grade-result text-center">
          <h2 className="text-2xl font-bold mb-4">Your Score</h2>
          <p className="text-xl mb-2">Correct Answers</p>
          {renderStars(gradeData.correct_count)}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GradeView;
