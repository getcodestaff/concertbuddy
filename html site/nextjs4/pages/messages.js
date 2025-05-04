import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return alert('Please log in');
    const { error } = await supabase.from('messages').insert([
      { sender_id: user.id, receiver_id: receiverId, message: newMessage }
    ]);
    if (error) alert(error.message);
    else {
      setNewMessage('');
      fetchMessages();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="mb-4">
        <input
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
      </div>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="p-2 border rounded bg-white text-gray-800">
            <p><strong>From:</strong> {msg.sender_id}</p>
            <p><strong>To:</strong> {msg.receiver_id}</p>
            <p>{msg.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
