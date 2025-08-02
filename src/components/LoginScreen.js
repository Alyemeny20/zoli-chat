// ✅ src/components/LoginScreen.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (username.trim() === "") return; // لا يسمح بالاسم الفارغ

    try {
      // ✨ تسجيل المستخدم في Firestore
      await setDoc(doc(db, "users", username), {
        name: username,
        status: "online",
      });

      // ✅ بعد التسجيل يتم فتح التطبيق
      onLogin(username);
    } catch (err) {
      console.error("❌ حدث خطأ أثناء تسجيل الدخول:", err);
      alert("حدث خطأ أثناء تسجيل الدخول. تحقق من الإعدادات.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-teal-500">
      <div className="bg-white p-6 rounded shadow text-center w-80">
        <h2 className="text-xl font-bold mb-4">أدخل اسمك للبدء</h2>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-teal-600 text-white px-4 py-2 rounded w-full hover:bg-teal-700"
        >
          دخول
        </button>
      </div>
    </div>
  );
}
