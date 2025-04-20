import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JoinLive = () => {
  const [link, setLink] = useState('');
  

  useEffect(() => {
    const fetchLatestLink = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_latest_live_streaming_link/');
        if (response.status === 200 && response.data.link) {
          setLink(response.data.link);
        }
      } catch (error) {
        console.error('Error fetching latest link:', error);
      }
    };

    fetchLatestLink();
  }, []);

//   const handleSubmit = async () => {
//     if (newLink.trim()) {
//       try {
//         const response = await axios.post('http://localhost:8000/api/save_live_streaming_link/', { link: newLink });
//         if (response.status === 201) {
//           setMessage('Link saved successfully');
//           setLink(newLink); // Update the displayed link
//           setNewLink(''); // Clear the input field
//         }
//       } catch (error) {
//         console.error('Error saving link:', error);
//         setMessage('Failed to save link');
//       }
//     } else {
//       setMessage('Link is required');
//     }
//   };

  return (
    <div className="live-streaming-container">
      <h1 className="text-2xl font-bold mb-4">Join Live Streaming</h1>
      {link && (
        <div className="mb-4">
          <p>Current Live Stream Link:</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {link}
          </a>
        </div>
      )}
      {/* <input
        type="text"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
        className="p-2 border rounded"
        placeholder="Enter new live streaming link..."
      />
      <button
        // onClick={handleSubmit}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
      {message && <p className="mt-4">{message}</p>} */}
    </div>
  );
};

export default JoinLive;
