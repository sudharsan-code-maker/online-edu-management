import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { courseName } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedCourseName, setEditedCourseName] = useState('');
  const [editedModules, setEditedModules] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedFees, setEditedFees] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/course_detail/${courseName}/`);
        const data = await response.json();
        setCourseDetail(data.course);
        setEditedCourseName(data.course.course);
        setEditedModules(data.course.modules);
        setEditedDescription(data.course.description);
        setEditedFees(data.course.fees.toString());
      } catch (error) {
        console.error('Error fetching course detail:', error);
      }
    };

    fetchCourseDetail();

    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, [courseName]);

  const handleModuleClick = async (module) => {
    try {
      const response = await fetch('http://localhost:8000/api/video_source/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modules: module.trim() }),
      });
      const data = await response.json();
      if (data.video_blob) {
        const videoUrl = `data:video/mp4;base64,${data.video_blob}`;
        const videoWindow = window.open();
        videoWindow.document.write(`<video width="100%" controls autoplay><source src="${videoUrl}" type="video/mp4"></video>`);
      } else {
        console.error('Error fetching video:', data.error);
      }
    } catch (error) {
      console.error('Error sending module data:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/update_course_details/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_id: courseDetail.unique_id,
          course: editedCourseName,
          modules: editedModules,
          description: editedDescription,
          fees: parseFloat(editedFees),
        }),
      });
      if (response.ok) {
        alert('Course details updated successfully!');
        setEditing(false);
      } else {
        throw new Error('Failed to update course details');
      }
    } catch (error) {
      console.error('Error updating course details:', error);
      alert('Error updating course details. Please try again.');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete_course/${courseName}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Course deleted successfully!');
        navigate('/courses');
      } else {
        const errorData = await response.json();
        console.error('Error deleting course:', errorData.error);
        alert('Error deleting course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course. Please try again.');
    }
  };

  if (!courseDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-detail-container p-8">
      <h1 className="text-2xl font-bold mb-10 absolute top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Course Detail
      </h1>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left bg-gray-800 text-white">Detail</th>
              <th className="px-4 py-2 text-left bg-gray-800 text-center text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(courseDetail).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{key}</td>
                <td className="border px-4 py-2">
                  {editing ? (
                    <input
                      type="text"
                      value={
                        key === 'course' ? editedCourseName :
                        key === 'modules' ? editedModules :
                        key === 'description' ? editedDescription :
                        key === 'fees' ? editedFees : value
                      }
                      onChange={(e) => {
                        if (key === 'course') setEditedCourseName(e.target.value);
                        if (key === 'modules') setEditedModules(e.target.value);
                        if (key === 'description') setEditedDescription(e.target.value);
                        if (key === 'fees') setEditedFees(e.target.value);
                      }}
                      className="w-full px-2 py-1"
                    />
                  ) : key === 'modules' ? (
                    value.split(',').map((module, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && ', '}
                        <a
                          href="#"
                          className="text-blue-500"
                          onClick={() => handleModuleClick(module)}
                        >
                          {module.trim()}
                        </a>
                      </React.Fragment>
                    ))
                  ) : (
                    value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 mr-4"
          onClick={() => navigate('/courses')}
        >
          Exit
        </button>
        {userRole === 'teacher' && !editing && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 mr-8"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
        {userRole === 'teacher' && editing && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 mr-8"
            onClick={handleSave}
          >
            Save
          </button>
        )}
        {userRole === 'teacher' && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
            onClick={handleDeleteCourse}
          >
            Delete Course
          </button>
        )}
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 hover:bg-yellow-600 ml-7"
          onClick={() => navigate(`/chat/${userRole}/${courseName}`)}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
