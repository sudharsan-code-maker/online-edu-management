import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setCorrectCount] = useState(0);
  const [setIncorrectCount] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check_assingment_answer/');
        setResults(response.data.results);
        setCorrectCount(response.data.correct_count);
        setIncorrectCount(response.data.incorrect_count);
      } catch (error) {
        console.error('Error fetching assignment results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-full w-full p-4 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row">
        <div className="flex-1 bg-blue-900 text-white p-6 rounded-lg flex flex-col items-center justify-between">
          <h5 className="text-xl mb-4">Your Result</h5>
          <div className="flex flex-col items-center bg-blue-800 p-6 rounded-full shadow-inner">
            {/* <h1 className="text-6xl mb-2">76</h1> */}
            <p>SCORE</p>
          </div>
          <div className="text-center mt-4">
            {/* <h2 className="text-2xl">Great</h2> */}
            {/* <p>You scored higher than 65% of the people who have taken these test</p> */}
          </div>
        </div>
        <div className="flex-1 p-6">
          <h3 className="text-2xl mb-4">Score Details</h3>
          <div className="flex flex-wrap space-x-4 overflow-x-auto">
            {results.map((result, index) => (
              <div key={index} className="flex-none bg-gray-100 p-4 rounded-lg w-64 m-2" style={{ '--i': '#d419451f', '--j': '#ea1123' }}>
                <div>
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <p className="text-sm">Student Answer: {result.student_answer}</p>
                  <p className="text-sm">Correct Answer: {result.correct_answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentResult;
