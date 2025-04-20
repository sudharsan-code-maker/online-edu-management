import React, { useState } from 'react';
import axios from 'axios';

const SubmitAssignment = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

      const response = await axios.post('http://localhost:8000/api/student_assignment_answer/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File upload response:', response.data);
      alert('File uploaded successfully!');
      setSelectedFile(null); 

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'submit-assignment-container' },
    React.createElement('h1', null, 'Submit Assignment'),
    React.createElement(
      'div',
      { className: 'mt-4' },
      React.createElement('input', { type: 'file', onChange: handleFileChange, accept: '.csv' }),
      React.createElement(
        'button',
        {
          className: 'bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600',
          onClick: handleUpload,
          disabled: uploading
        },
        uploading ? 'Uploading...' : 'Upload Assignment'
      )
    )
  );
};

export default SubmitAssignment;
