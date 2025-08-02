import React from "react";

const ChatHeader = ({
  user,
  avatarUrl = "/images/avatar.png",
  status,
  onAudioCall,
  onVideoCall,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b shadow">
      {/* بيانات المستخدم */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div>
          <div className="font-bold text-lg">{user}</div>
          <div
            className={`text-sm ${
              status === "online" ? "text-green-500" : "text-gray-500"
            }`}
          >
            {status === "online" ? "متصل الآن" : "غير متصل"}
          </div>
        </div>
      </div>

      {/* أزرار المكالمات */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAudioCall}
          className="text-teal-600 text-xl hover:text-teal-800"
          title="مكالمة صوتية"
        >
          📞
        </button>
        <button
          onClick={onVideoCall}
          className="text-teal-600 text-xl hover:text-teal-800"
          title="مكالمة فيديو"
        >
          🎥
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
