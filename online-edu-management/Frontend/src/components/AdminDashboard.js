import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [assignmentResult, setAssignmentResult] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountResponse = await fetch('http://localhost:8000/api/get_user_count/');
        if (!userCountResponse.ok) {
          throw new Error('Failed to fetch user count');
        }
        const userCountData = await userCountResponse.json();
        setUserCount(userCountData.user_count);

        const coursesResponse = await fetch('http://localhost:8000/api/courses/');
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses);

        const assignmentResponse = await fetch('http://localhost:8000/api/check_assignment_count/');
        if (!assignmentResponse.ok) {
          throw new Error('Failed to fetch assignment count');
        }
        const assignmentData = await assignmentResponse.json();
        setAssignmentResult(assignmentData.Assignmnet);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleMonitorStudents = () => {
    navigate('/monitor-students');
  };

  const handleStudentReport = () => {
    navigate('/student-report');
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-center bg-gray-100 p-6 relative ml-4">
      <button
        className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition duration-200 absolute bottom-4 right-40"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-200 absolute bottom-4 right-96"
        onClick={handleMonitorStudents}
      >
        MonitorStudent
      </button>
      <button
        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition duration-200 absolute bottom-4 right-[240px]"
        onClick={handleStudentReport}
      >
        StudentReport
      </button>
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg text-center w-full max-w-lg ml-4">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 md:p-12 rounded-lg shadow-inner text-white mb-6 md:mb-10">
          <div className="text-4xl md:text-6xl font-bold">{userCount}</div>
          <div className="text-lg md:text-xl">NUMBER OF USERS</div>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 md:p-12 rounded-lg shadow-inner text-white mb-6 md:mb-10">
          <div className="text-xl md:text-2xl font-bold">Courses</div>
          <ul className="mt-2 md:mt-4">
            {courses.map((course, index) => (
              <li key={index} className="text-base md:text-lg">{course}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 md:p-12 rounded-lg shadow-inner text-white mb-6 md:mb-10">
          <div className="text-xl md:text-2xl font-bold">Assignment Result</div>
          <div className="text-4xl md:text-6xl font-bold mt-2 md:mt-4">{assignmentResult}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
