import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadUsers();
    loadMessages();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, username');
    if (data) setAllUsers(data);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(username), receiver:profiles!messages_receiver_id_fkey(username)')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!receiver || !text) return;
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: receiver, message: text }]);
    setText('');
    loadMessages();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="mb-4">
        <select value={receiver} onChange={(e) => setReceiver(e.target.value)} className="p-2 border rounded w-full mb-2">
          <option value="">Select user</option>
          {allUsers.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." className="p-2 border rounded w-full mb-2" />
        <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
      </div>
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="p-4 bg-white border rounded shadow">
            <p><strong>From:</strong> {msg.sender?.username || msg.sender_id}</p>
            <p><strong>To:</strong> {msg.receiver?.username || msg.receiver_id}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
