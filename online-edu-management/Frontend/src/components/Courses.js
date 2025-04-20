import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCard = ({ courseName }) => {
  return (
    <div className="course-card">
      <Link to={`/course_detail/${courseName}`}>
        <h2>{courseName}</h2>
      </Link>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();

    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
      if (role === 'admin') {
        navigate('/admin-dashboard'); 
      }
    }
  }, [navigate]);

  const handleAddCourse = () => {
    navigate('/add-course');
  };

  const handleAssignment = () => {
    navigate('/assignment');
  };

  const handleTakeAssignment = () => {
    navigate('/take-assignment');
  };

  const handleSubmitAssignment = () => {
    navigate('/submit-assignment');
  };

  const handleAssignmentResult = () => {
    navigate('/assignment-result');
  };

  const handleQuizUpload = () => {
    navigate('/quiz-upload');
  };

  const handleDiscussionForum = () => {
    navigate('/discussion-forum');
  };

  const handleLiveStreaming = () => {
    navigate('/live-streaming');
  };

  const handleJoinLive = () => {
    navigate('/join-live');
  };

  const handleGradeView = () => {
    navigate('/grade-view');
  };

  const handleViewReport = () => {
    navigate('/view-report');
  };

  return (
    <div className="course-container">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 academic-achievers-heading">
        {/* <span className="text-orange-500 font-serif top-50">Academic</span>
        <span className="text-orange-500 font-serif">Achievers</span> */}
      </h1>
      <div className="course-list">
        {courses.map((course, index) => (
          <CourseCard key={index} courseName={course} />
        ))}
      </div>
      {userRole === 'teacher' && (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
            onClick={handleAddCourse}
          >
            Add Course
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 ml-4 hover:bg-yellow-600"
            onClick={handleAssignment}
          >
            Assignment Upload
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4 hover:bg-blue-600"
            onClick={handleQuizUpload}
          >
            Quiz Upload
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-600 ml-4"
            onClick={handleAssignmentResult}
          >
            Assignment Result
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded mt-4 hover:bg-purple-600 ml-5"
            onClick={handleLiveStreaming}
          >
            Live Streaming
          </button>
        </>
      )}
      {userRole !== 'teacher' && (
        <div className="mt-4">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-5"
            onClick={() => navigate('/quiz')}
          >
            Quiz
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-5"
            onClick={handleTakeAssignment}
          >
            Take Assignment
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 ml-5"
            onClick={handleSubmitAssignment}
          >
            Submit Assignment
          </button>
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded mt-4 hover:bg-teal-600 ml-5"
            onClick={handleJoinLive}
          >
            Join Live
          </button>
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded mt-4 hover:bg-teal-600 mb-10 ml-5"
            onClick={handleViewReport}
          >
            View Report
          </button>
        </div>
      )}
      <button
        className="bg-teal-500 text-white px-4 py-2 rounded mt-4 hover:bg-teal-600 mb-10 ml-5"
        onClick={handleDiscussionForum}
      >
        Discussion Forum
      </button>
      <button
        className="bg-teal-500 text-white px-4 py-2 rounded mt-4 hover:bg-teal-600 mb-10 ml-5"
        onClick={handleGradeView}
      >
        Grade View
      </button>
    </div>
  );
};

export default Courses;
