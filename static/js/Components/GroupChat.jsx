/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuill } from 'react-quilljs';
import useGetLoggedInUser from '../hooks/useGetLoggedInUserDetails';

import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import Message from './Message';
import Spinner from './spinner/Spinner';

const chatSocketBaseURL =
  process.env.REACT_APP_CHAT_SOCKET_URL ||
  'wss://api.lms.v2.powerlearnprojectafrica.org/chat/socket';

function GroupChat() {
  const user_id = useGetLoggedInUserId();
  const user = useGetLoggedInUser();
  const username = `${user.firstname.trim()} ${user.lastname.trim()}`;
  const { groupId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [socket, setSocket] = useState(null);

  const { quill, quillRef, Quill } = useQuill({
    modules: { magicUrl: true, toolbar: false },
  });

  if (Quill && !quill) {
    // eslint-disable-next-line global-require
    const MagicUrl = require('quill-magic-url').default;
    Quill.register('modules/magicUrl', MagicUrl);
  }

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const token = localStorage.getItem('token');
    const ws =
      token &&
      new WebSocket(
        `${chatSocketBaseURL}/group_chat?group_id=${groupId}&Authorization=${token}`
      );

    ws.onopen = () => {
      setIsLoading(true);
    };

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data) || [];
      const groupMessages = res.length
        ? res.filter((message) => message.group_id === groupId)
        : [];
      setMessages(groupMessages);
      setIsLoading(false); // Set loading state to false when messages are received
    };

    ws.onerror = () => {
      // toast.error("Couldn't get messages. Please try again!");
      setIsLoading(false); // Set loading state to false when there's an error
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [groupId]);

  const handleSendMessage = () => {
    if (!quill) return;

    const plainText = quill.getText();
    const message = {
      user_name: username,
      message: plainText,
    };
    socket.send(JSON.stringify(message));
    setNewMessage('');
    quill.setText('\n');
  };

  const isEmpty = newMessage === '<p><br></p>' || newMessage === '';

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setNewMessage(quill.root.innerHTML);
      });
    }
  }, [quill, quillRef]);

  return (
    <div className="mt-5 ">
      <div className="bg-white mt-5 p-3 rounded-md">
        <p className="font-semibold underline uppercase mb-5">
          DISCLAIMER: Messages will disappear after 7 days.
        </p>
        {isLoading && <Spinner />}
        <div className="bg-chatbg p-2 space-y-4">
          {messages.map((message, index) => (
            <Message
              fromMe={message.user_id === user_id}
              key={`${message.id + index}`}
              text={message.message}
              sender={message.user_name}
              timeStamp={message.created_at}
            />
          ))}
          <div className="mt-2 space-y-4">
            <div ref={quillRef} />
            <button
              className={` uppercase font-medium rounded-sm ${
                isEmpty
                  ? 'bg-gray-500 text-black px-3 py-1 cursor-not-allowed'
                  : 'bg-claret-500 text-white px-3 py-1'
              }`}
              type="button"
              onClick={handleSendMessage}
              disabled={isEmpty}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupChat;
