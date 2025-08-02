import React, { useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

export default function CallManager({ onEndCall }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [pc, setPc] = useState(null);
  const [callDocId, setCallDocId] = useState(null);
  const [inCall, setInCall] = useState(false);

  // 📌 إعداد peerConnection
  const createPeerConnection = () => {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const newPc = new RTCPeerConnection(configuration);

    newPc.onicecandidate = async (event) => {
      if (event.candidate && callDocId) {
        await addDoc(collection(db, "calls", callDocId, "candidates"), event.candidate.toJSON());
      }
    };

    newPc.ontrack = (event) => {
      console.log("✅ استقبلنا بث الطرف الآخر");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return newPc;
  };

  // 📞 بدء المكالمة
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    const newPc = createPeerConnection();
    stream.getTracks().forEach((track) => newPc.addTrack(track, stream));

    const callDoc = doc(collection(db, "calls"));
    setCallDocId(callDoc.id);

    const offer = await newPc.createOffer();
    await newPc.setLocalDescription(offer);

    await setDoc(callDoc, { offer });

    // 📌 استمع للـ answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !newPc.currentRemoteDescription) {
        newPc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    // 📌 استمع للـ candidates
    onSnapshot(collection(db, "calls", callDoc.id, "candidates"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          newPc.addIceCandidate(candidate);
        }
      });
    });

    setPc(newPc);
    setInCall(true);
  };

  // ❌ إنهاء المكالمة
  const endCall = () => {
    if (pc) pc.close();
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    remoteVideoRef.current.srcObject = null;
    setPc(null);
    setCallDocId(null);
    setInCall(false);
    if (onEndCall) onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full max-w-2xl text-white flex flex-col gap-4">
        <h2 className="text-xl font-bold">📞 مكالمة فيديو</h2>

        {/* الفيديو المحلي */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg border"
        ></video>

        {/* فيديو الطرف الآخر */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border mt-2"
        ></video>

        <div className="flex justify-between mt-4">
          {!inCall ? (
            <button
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              ▶️ بدء المكالمة
            </button>
          ) : (
            <button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              ❌ إنهاء المكالمة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
