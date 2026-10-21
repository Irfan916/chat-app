import { useState, useEffect, useRef } from 'react';
import { MdDelete } from "react-icons/md";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Avatar from '../components/Avatar';

export default function ChatRoom() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);

  // 1. Listen for messages
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  // 2. Auto-scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 3. Send message
  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Safely get a name
    const senderName = user.displayName || (user.email ? user.email.split('@')[0] : 'Anonymous');

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      sender: senderName,
      uid: user.uid,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
    });

    setNewMessage('');
  }

  // 4. Delete message
  async function handleDelete(messageId) {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteDoc(doc(db, 'messages', messageId));
      } catch (error) {
        console.error("Error deleting message: ", error);
      }
    }
  }

  // 5. Listen for who is typing
  useEffect(() => {
    const q = query(collection(db, 'typing'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.isTyping && u.id !== user.uid) // Don't show yourself
        .map(u => u.name);
      setTypingUsers(users);
    });
    return unsubscribe;
  }, [user.uid]);

  // 6. Handle typing

  async function handleTyping(e) {
    setNewMessage(e.target.value);

    // Set typing status to true in DB
    const typingDocRef = doc(db, 'typing', user.uid);
    const senderName = user.displayName || (user.email ? user.email.split('@')[0] : 'Someone');
    await setDoc(typingDocRef, { isTyping: true, name: senderName });

    // Clear previous timeout if user is still typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // After 3s of no typing, set isTyping to false
    typingTimeoutRef.current = setTimeout(async () => {
      await setDoc(typingDocRef, { isTyping: false, name: senderName });
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <h1 className="text-xl font-bold text-white">Global Chat</h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src={user.photoURL} name={user.displayName || user.email} size="w-8 h-8" />
          <span className="text-slate-300 text-sm hidden sm:block">
            {user.displayName || user.email || 'User'}
          </span>
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-300 transition">
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.uid === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <Avatar src={msg.photoURL} name={msg.sender} />
              <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
                {!isMe && (
                  <p className="text-xs text-slate-400 font-bold mb-1">
                    {msg.sender}
                  </p>
                )}
                <p className="wrap-break-word">{msg.text}</p>
              </div>
              {isMe && (
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="group-hover:opacity-100 text-red-400 hover:text-red-300 transition self-center px-2"
                  title="Delete message"
                >
                  <MdDelete
                    size={20}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  />
                </button>
              )}
            </div>
          );
        })}
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-slate-400 italic px-2">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 p-4 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}