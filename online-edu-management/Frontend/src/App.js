import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './components/App.css';
import Login from './components/Login';
import Register from './components/Register';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import AddCourse from './components/AddCourse';
import Quiz from './components/Quiz';
import QuizUpload from './components/QuizUpload';
import AssignmentUpload from './components/AssignmentUpload';
import TakeAssignment from './components/TakeAssignment';
import SubmitAssignment from './components/SubmitAssignment';
import AssignmentResult from './components/AssignmentResult';
import AdminDashboard from './components/AdminDashboard';
import ChatPage from './components/ChatPage';
import DiscussionForum from './components/DiscussionForum';
import LiveStreaming from './components/LiveStreaming';
import JoinLive from './components/JoinLive';
import GradeView from './components/GradeView';
import MonitorStudents from './components/MonitorStudents';
import StudentReport from './components/StudentReport';
import ViewReport from './components/ViewReport';

function App() {
  const [isRegistered, setIsRegistered] = useState(true);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="form-container">
                {isRegistered ? (
                  <Login setIsRegistered={setIsRegistered} />
                ) : (
                  <Register setIsRegistered={setIsRegistered} />
                )}
              </div>
            }
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course_detail/:courseName" element={<CourseDetail />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-upload" element={<QuizUpload />} />
          <Route path="/assignment" element={<AssignmentUpload />} />
          <Route path="/take-assignment" element={<TakeAssignment />} />
          <Route path="/submit-assignment" element={<SubmitAssignment />} />
          <Route path="/assignment-result" element={<AssignmentResult />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/chat/:userRole/:courseName" element={<ChatPage />} />
          <Route path="/discussion-forum" element={<DiscussionForum />} />
          <Route path="/live-streaming" element={<LiveStreaming />} />
          <Route path="/join-live" element={<JoinLive />} />
          <Route path="/grade-view" element={<GradeView />} />
          <Route path="/monitor-students" element={<MonitorStudents />} />
          <Route path="/student-report" element={<StudentReport />} />
          <Route path="/view-report" element={<ViewReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
