import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionForum = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'null');

  useEffect(() => {
    fetchMessages(); 
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/discussion_forum/');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post('http://localhost:8000/api/discussion_forum/', {
          message: newMessage,
          user_role: userRole
        });
        if (response.status === 201) {
          setMessages([...messages, { id: response.data.id, message: newMessage, user_role: userRole }]);
          setNewMessage('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      const response = await axios.delete('http://localhost:8000/api/delete_all_messages/');
      if (response.status === 200) {
        setMessages([]); 
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  return (
    <div className="discussion-forum-container p-8">
      <h1 className="text-2xl font-bold mb-4 top-20 left-100 right 80">Discussion Forum For All Courses</h1>
      <div className="chat-box bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <div className="messages h-80 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message p-2 mb-2 rounded ${message.user_role === 'teacher' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
            >
              {message.user_role}: {message.message}
            </div>
          ))}
        </div>
        <div className="input-box flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
          <button
            onClick={handleDeleteAllMessages}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
