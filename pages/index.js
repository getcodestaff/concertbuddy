import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [form, setForm] = useState({ artist: '', city: '', genre: '', date: '', description: '' });
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ artist: '', city: '', genre: '' });
  const [loginEmail, setLoginEmail] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [message, setMessage] = useState('');
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    fetchProfiles();
    fetchPosts();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, username');
    const map = {};
    data?.forEach(p => map[p.id] = p.username);
    setProfiles(map);
  };

  const fetchPosts = async () => {
    console.log("Loading posts...");
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: true });
    console.log("Data:", data);
    console.log("Error:", error);
    if (!error) setPosts(data);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in');
    const { error } = await supabase.from('posts').insert([{ ...form, user_id: user.id }]);
    if (error) return alert(error.message);
    setForm({ artist: '', city: '', genre: '', date: '', description: '' });
    fetchPosts();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) alert(error.message);
    else alert('Check your email for the login link!');
  };

  const sendMessage = async (toId) => {
    if (!message) return;
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: toId, message }]);
    alert('Message sent!');
    setReplyTo(null);
    setMessage('');
  };

  return (
    <>
      <Head>
        <title>Concert Buddy</title>
      </Head>
      <header className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎵 Concert Buddy</h1>
        <nav className="space-x-4">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#post" className="hover:underline">Post</a>
          <a href="/messages" className="hover:underline">Messages</a>
          <a href="/profile" className="hover:underline">Profile</a>
          <a href="/login" className="hover:underline">Login</a>
        </nav>
      </header>

      <section className="text-center py-16 bg-gradient-to-r from-indigo-800 to-purple-800 text-white px-6">
        <h2 className="text-4xl font-extrabold mb-4">Connect Over Music</h2>
        <p className="text-lg mb-6">Find concert buddies, share plans, and message fans who love what you love.</p>
        <a href="#post" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition">Get Started</a>
      </section>

      <section id="login" className="max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow text-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Log In with Magic Link</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded">
            Send Magic Link
          </button>
        </form>
      </section>

      <main className="p-6 max-w-5xl mx-auto space-y-12">
        <section id="post" className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">🎫 Post a Concert</h2>
          {user ? (
            <form onSubmit={handlePost} className="grid gap-4 md:grid-cols-2">
              <input required placeholder="Artist" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} className="p-2 border rounded" />
              <input required placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="p-2 border rounded" />
              <input required placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} className="p-2 border rounded" />
              <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />
              <textarea placeholder="Details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="p-2 border rounded col-span-2" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-2">Submit</button>
            </form>
          ) : (
            <p className="text-gray-600">Log in to post your concerts.</p>
          )}
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📢 Browse Concerts</h2>
          <div className="mt-6 space-y-4">
            {posts.length === 0 && <p className="text-gray-600">No posts found.</p>}
            {posts.map(post => (
              <div key={post.id} className="border p-4 rounded shadow bg-gray-50">
                <h3 className="text-lg font-bold">{post.artist} — {post.city}</h3>
                <p className="text-sm text-gray-600 mb-1">{post.genre} | {new Date(post.date).toLocaleDateString()}</p>
                <p>{post.description}</p>
                <p className="text-sm text-gray-500 italic">
                  Posted by: {profiles[post.user_id] || 'User'}
                </p>
                {user && post.user_id !== user.id && (
                  <div className="mt-2">
                    <button onClick={() => setReplyTo(post.user_id)} className="text-blue-600 underline">Message {profiles[post.user_id] || 'User'}</button>
                    {replyTo === post.user_id && (
                      <div className="mt-2">
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Type your message..." />
                        <button onClick={() => sendMessage(post.user_id)} className="bg-green-600 text-white px-3 py-1 rounded">Send</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
