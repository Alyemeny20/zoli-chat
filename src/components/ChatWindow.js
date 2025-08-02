import React from 'react';

const ChatWindow = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
      {messages.map((msg) => {
        const isMine = msg.sender === currentUser; // 👈 الآن نقارن باسم المستخدم
        return (
          <div
            key={msg.id}
            className={`max-w-[75%] p-3 rounded-lg shadow ${
              isMine
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-200 text-black'
            }`}
          >
            <div className="text-sm">{msg.text}</div>
            <div
              className={`text-[10px] mt-1 ${
                isMine ? 'text-white/70' : 'text-gray-500'
              } text-right`}
            >
              {msg.timestamp}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatWindow;
