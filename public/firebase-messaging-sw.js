// ✅ استيراد مكتبات Firebase الخاصة بـ Messaging
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// ✅ نفس إعدادات firebaseConfig المستخدمة في مشروعك
firebase.initializeApp({
  apiKey: "AIzaSyDrydPCzL-WISMKN5v_ps8Xy4bIHn90XDA",
  authDomain: "zoli-chat.firebaseapp.com",
  projectId: "zoli-chat",
  storageBucket: "zoli-chat.firebasestorage.app",
  messagingSenderId: "766283585350",
  appId: "1:766283585350:web:5548302e54f47b9c1ef747",
  measurementId: "G-THTR48Q3Q3"
});

// ✅ الحصول على الـ messaging
const messaging = firebase.messaging();

// ✅ استقبال الإشعار في الخلفية (حتى لو كان التطبيق مقفول)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || '📩 رسالة جديدة';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك رسالة جديدة الآن ✅',
    icon: '/logo192.png' // 🔥 ضع هنا أيقونة من مجلد public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
