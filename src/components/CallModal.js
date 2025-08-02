import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PhoneOff } from "lucide-react";

const CallModal = ({ onClose, isVideo }) => {
  const localAudioRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localAudioRef.current.srcObject = stream;
        localAudioRef.current.muted = true;
        localAudioRef.current.play();
      })
      .catch((err) => {
        console.error("❌ خطأ في الوصول إلى المايكروفون:", err);
        setError("⚠️ لم يتم الوصول إلى المايكروفون. تحقق من الإعدادات أو أذونات المتصفح.");
      });
  }, []);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white p-4">
      <div className="text-xl font-semibold mb-4">
        {error || (isVideo ? "جاري إجراء مكالمة فيديو..." : "جاري إجراء مكالمة صوتية...")}
      </div>
      <audio ref={localAudioRef} autoPlay className="hidden" />

      {!error && (
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-teal-600 rounded-full animate-ping"></div>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
      >
        <PhoneOff className="w-5 h-5" /> إنهاء المكالمة
      </button>
    </div>,
    document.body
  );
};

export default CallModal;
