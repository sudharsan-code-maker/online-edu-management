import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8000/api/teacher_quize/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File upload response:', response.data);
      alert('File uploaded successfully!');
      setSelectedFile(null);
      navigate('/courses');

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="quiz-upload-container p-8">
      <h1 className="text-2xl font-bold mb-10">Quiz Upload</h1>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizUpload;
