import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [course, setCourse] = useState('');
  const [mentor, setMentor] = useState('');
  const [modules, setModules] = useState('');
  const [description, setDescription] = useState('');
  const [fees, setFees] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      course,
      mentor,
      modules,
      description,
      fees
    };

    try {
      const response = await fetch('http://localhost:8000/api/add-course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        alert('Course added successfully');
        navigate('/courses');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('An error occurred while adding the course.');
    }
  };

  return (
    <div className="add-course-container p-8">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <p className="text-center -mt-2 mb-6 font-bold">Add New Course</p> 
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Course Name</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mentor</label>
            <input
              type="text"
              value={mentor}
              onChange={(e) => setMentor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Modules</label>
            <input
              type="text"
              value={modules}
              onChange={(e) => setModules(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fees</label>
            <input
              type="number"
              step="0.01"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default AddCourse;
