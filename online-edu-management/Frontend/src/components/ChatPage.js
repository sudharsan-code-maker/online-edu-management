import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

const ChatPage = () => {
  const location = useLocation();
  const { courseName } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userRole = location.pathname.split('/')[2];
  const lastMessageRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/handle_chat_message/${userRole}/${encodeURIComponent(courseName)}/`);
        if (response.status === 200) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [courseName, userRole]);

  useEffect(() => {
    if (lastMessageRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isReply = lastMessage.sender !== lastMessageRef.current.sender;

      if (isReply) {
        clearTimeout(notificationTimeoutRef.current);
        lastMessageRef.current = null;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(`http://localhost:8000/api/handle_chat_message/${userRole}/${encodeURIComponent(courseName)}/`, {
          message: newMessage,
        });
        if (response.status === 201) {
          const sentMessage = { text: newMessage, sender: userRole };
          setMessages([...messages, sentMessage]);
          setNewMessage('');

          lastMessageRef.current = sentMessage;
          notificationTimeoutRef.current = setTimeout(() => {
            sendNotification(userRole === 'teacher' ? 'null' : 'teacher');
          }, 10000);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const sendNotification = async (recipientRole) => {
    try {
      await axios.post(`http://localhost:8000/api/send_notification/${recipientRole}/`, {
        message: `You have a new message from ${userRole}`,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="chat-page-container p-8">
      <h1 className="text-2xl font-bold top-40">Chat Page</h1>
      <div className="chat-box bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <div className="messages h-80 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message p-2 mb-2 rounded ${message.sender === 'teacher' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
            >
              {message.text}
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
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
