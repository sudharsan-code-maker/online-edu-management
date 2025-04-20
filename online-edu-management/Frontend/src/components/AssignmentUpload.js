import React, { useState } from 'react';
import axios from 'axios';

const AssignmentUpload = () => {
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
  
      const response = await axios.post('http://localhost:8000/api/teacher_questions/', formData, {
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
  

  return (
    <div className="assignment-upload bg-white p-6 max-w-md mx-auto my-8 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Assignment</h2>
      <input type="file" onChange={handleFileChange} accept=".csv"
        className="block border border-gray-300 rounded px-4 py-2 w-full mb-4"
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      <p className="text-gray-600 text-sm mt-2">Only CSV files are allowed.</p>
    </div>
  );
};

export default AssignmentUpload;
