import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";

export default function IncomingCallModal({ currentUser, onClose }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const pc = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    // 🔹 الاستماع لأي مكالمة موجهة لهذا المستخدم
    const q = query(collection(db, "calls"), where("to", "==", currentUser));
    const unsub = onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          setIncomingCall({ id: change.doc.id, ...change.doc.data() });
        }
      });
    });
    return () => unsub();
  }, [currentUser]);

  const answerCall = async () => {
    if (!incomingCall) return;

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (localAudioRef.current) localAudioRef.current.srcObject = localStream;

      pc.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      // إضافة المسارات الصوتية
      localStream.getTracks().forEach((track) => {
        pc.current.addTrack(track, localStream);
      });

      // عندما يصل الصوت البعيد
      pc.current.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      };

      // عندما ينتج ICE Candidate من هذا الطرف
      pc.current.onicecandidate = async (event) => {
        if (event.candidate) {
          const answerCandidates = collection(
            db,
            "calls",
            incomingCall.id,
            "answerCandidates"
          );
          await addDoc(answerCandidates, event.candidate.toJSON());
        }
      };

      // ضع الـ Offer الذي أرسله المتصل
      await pc.current.setRemoteDescription(incomingCall.offer);

      // أنشئ الـ Answer وأرسله
      const answerDescription = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answerDescription);

      await updateDoc(doc(db, "calls", incomingCall.id), {
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      });

      alert(`📞 أنت الآن في مكالمة مع ${incomingCall.from}`);
    } catch (err) {
      console.error("❌ خطأ أثناء الرد على المكالمة:", err);
      alert("حدث خطأ أثناء الرد على المكالمة.");
    }
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          📞 مكالمة واردة من {incomingCall.from}
        </h2>
        <p className="text-gray-500 mb-4">هل تريد الرد على المكالمة؟</p>

        {/* الصوت المحلي والبعيد */}
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />

        <div className="flex gap-4">
          <button
            onClick={answerCall}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
          >
            ✅ رد
          </button>
          <button
            onClick={() => {
              setIncomingCall(null);
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            ❌ رفض
          </button>
        </div>
      </div>
    </div>
  );
}
