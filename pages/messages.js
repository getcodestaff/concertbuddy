import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadUsers();
  }, []);

  useEffect(() => {
    if (user && receiverId) {
      loadThread();
    }
  }, [user, receiverId]);

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, username');
    if (data) setAllUsers(data);
  };

  const loadThread = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(username), receiver:profiles!messages_receiver_id_fkey(username)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (data) {
      const filtered = data.filter(msg =>
        (msg.sender_id === user.id && msg.receiver_id === receiverId) ||
        (msg.receiver_id === user.id && msg.sender_id === receiverId)
      );
      setThread(filtered);
    }
  };

  const sendMessage = async () => {
    if (!message || !receiverId) return;
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: receiverId, message }]);
    setMessage('');
    loadThread();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      <select
        value={receiverId}
        onChange={(e) => {
          const selectedUser = allUsers.find(u => u.id === e.target.value);
          setReceiverId(e.target.value);
          setReceiverName(selectedUser?.username || '');
        }}
        className="p-2 border rounded w-full mb-4"
      >
        <option value="">Select a user</option>
        {allUsers.map(u => (
          u.id !== user?.id && <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      {receiverId && (
        <>
          <div className="border rounded p-4 mb-4 bg-white shadow h-64 overflow-y-auto space-y-2">
            {thread.map(msg => (
              <div
                key={msg.id}
                className={`p-2 rounded ${msg.sender_id === user.id ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender?.username} — {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder={`Message ${receiverName}...`}
          />
          <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
        </>
      )}
    </div>
  );
}
