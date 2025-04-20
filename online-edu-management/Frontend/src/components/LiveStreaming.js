import React, { useState } from 'react';
import axios from 'axios';

const LiveStreaming = () => {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (link.trim()) {
      try {
        const response = await axios.post('http://localhost:8000/api/save_live_streaming_link/', { link });
        if (response.status === 201) {
          setMessage('Link saved successfully');
        }
      } catch (error) {
        console.error('Error saving link:', error);
        setMessage('Failed to save link');
      }
    } else {
      setMessage('Link is required');
    }
  };

  return (
    <div className="live-streaming-container">
      <h1 className="text-2xl font-bold mb-4">Live Streaming</h1>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="p-2 border rounded"
        placeholder="Enter live streaming link..."
      />
      <button
        onClick={handleSubmit}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default LiveStreaming;
