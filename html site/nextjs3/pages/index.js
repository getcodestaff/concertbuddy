import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ artist: '', city: '', date: '', description: '' });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Check your email for the login link');
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in first');
    const { artist, city, date, description } = form;
    const { error } = await supabase.from('posts').insert([
      {
        user_id: user.id,
        artist,
        city,
        date,
        description,
      },
    ]);
    if (error) return alert(error.message);
    alert('Posted!');
    setForm({ artist: '', city: '', date: '', description: '' });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white font-sans">
      <Head>
        <title>Concert Buddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-black bg-opacity-60 backdrop-blur-md py-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <h1 className="text-3xl font-extrabold tracking-wide">Concert Buddy</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-gray-300">Features</a>
            <a href="#post" className="hover:text-gray-300">Post</a>
            <a href="#login" className="hover:text-gray-300">Login</a>
          </nav>
        </div>
      </header>

      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">Connect Over Music</h2>
        <p className="text-lg max-w-xl mb-6 text-gray-200 drop-shadow-sm">
          Find concert buddies, share plans, and message fans who love what you love.
        </p>
        <a href="#post" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg transition">Get Started</a>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-indigo-900"></div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        <section id="features" className="grid gap-12 md:grid-cols-3 text-center">
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">🎤 Post Shows</h3>
            <p>Let others know where you're going. Meet fans who share your taste.</p>
          </div>
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">🔎 Discover Fans</h3>
            <p>Browse by artist, genre, or city and find others attending the same gigs.</p>
          </div>
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">💬 Chat Instantly</h3>
            <p>Message fellow users to coordinate meetups or simply vibe over music.</p>
          </div>
        </section>

        <section id="post" className="bg-white text-gray-900 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">📅 Share a Concert Plan</h2>
          {user ? (
            <form onSubmit={handlePost} className="grid gap-6 md:grid-cols-2">
              <input name="artist" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} placeholder="Artist Name" className="p-3 rounded border" required />
              <input name="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className="p-3 rounded border" required />
              <input name="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="p-3 rounded border col-span-2" required />
              <textarea name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details (venue, meetup spot)" className="p-3 rounded border col-span-2"></textarea>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2">Post Your Plan</button>
            </form>
          ) : (
            <p className="text-center text-gray-600">Log in to post a concert plan.</p>
          )}
        </section>

        <section className="bg-white text-gray-900 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">📢 All Concert Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-100 p-4 rounded shadow">
                  <h3 className="text-xl font-bold">{post.artist} in {post.city}</h3>
                  <p className="text-gray-700">{post.description}</p>
                  <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No concert posts yet.</p>
          )}
        </section>

        <section id="login" className="bg-white text-gray-900 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold mb-4 text-center">🔐 Log In with Magic Link</h2>
          <p className="text-center text-gray-700 mb-6">Sign in to share your plans and connect with others.</p>
          <form onSubmit={handleLogin} className="grid gap-4 md:grid-cols-2 max-w-xl mx-auto">
            <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded border" required />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Send Login Link</button>
          </form>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-300 py-10 bg-black bg-opacity-50">
        <p>&copy; {new Date().getFullYear()} Concert Buddy. Built with 🎵 for music lovers everywhere.</p>
      </footer>
    </div>
  );
}
