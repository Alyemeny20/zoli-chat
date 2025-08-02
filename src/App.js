import React, { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/MessageInput';
import CallModal from './components/CallModal';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, query, orderBy } from 'firebase/firestore';
import Peer from 'peerjs';

export default function App() {
  const [user, setUser] = useState(null);
  const [contactsState, setContactsState] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [peer, setPeer] = useState(null);

  const handleLogin = async (username) => {
    setUser(username);
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on('open', async (id) => {
      await setDoc(doc(db, 'users', username), { name: username, status: 'online', peerId: id });
    });

    newPeer.on('call', (call) => {
      setIncomingCall(call);
      setCallModalOpen(true);
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const users = snap.docs.map((d) => d.data());
      setContactsState(users.filter((u) => u.name !== user));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!selectedContact) return;
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => d.data()).filter((m) =>
        (m.from === user && m.to === selectedContact.name) ||
        (m.from === selectedContact.name && m.to === user)
      );
      setMessages({ [selectedContact.name]: msgs });
    });
    return () => unsub();
  }, [selectedContact, user]);

  const sendMessage = async (text) => {
    if (!selectedContact || text.trim() === '') return;
    await addDoc(collection(db, 'messages'), {
      from: user,
      to: selectedContact.name,
      text,
      timestamp: Date.now()
    });
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar
            contacts={contactsState}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
          />
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                <ChatHeader
                  user={selectedContact.name}
                  avatarUrl={selectedContact.avatarUrl || "/images/avatar.png"}
                  status="online"
                  onAudioCall={() => setCallModalOpen(true)}
                  onVideoCall={() => {}}
                  />
                <ChatWindow
                  messages={messages[selectedContact.name] || []}
                  currentUser={user}
                />
                <ChatInput onSend={sendMessage} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                اختر جهة اتصال لبدء المحادثة
              </div>
            )}
          </div>
          {callModalOpen && selectedContact && (
            <CallModal
              isOpen={callModalOpen}
              onClose={() => setCallModalOpen(false)}
              currentUser={user}
              contact={selectedContact}
              incomingCall={incomingCall}
              peer={peer}
            />
          )}
        </>
      )}
    </div>
  );
}
