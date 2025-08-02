// ✅ استيراد مكتبات Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// ✅ إعدادات مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDrydPCzL-WISMKN5v_ps8Xy4bIHn90XDA",
  authDomain: "zoli-chat.firebaseapp.com",
  projectId: "zoli-chat",
  storageBucket: "zoli-chat.firebasestorage.app",
  messagingSenderId: "766283585350",
  appId: "1:766283585350:web:5548302e54f47b9c1ef747",
  measurementId: "G-THTR48Q3Q3"
};

// ✅ تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// ✅ قاعدة البيانات Firestore
export const db = getFirestore(app);

// ✅ خدمة الإشعارات Firebase Cloud Messaging
export const messaging = getMessaging(app);
