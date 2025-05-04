import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [form, setForm] = useState({ artist: '', city: '', genre: '', date: '', description: '' });
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ artist: '', city: '', genre: '' });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*').order('date', { ascending: true });
    const { artist, city, genre } = filters;
    if (artist) query = query.ilike('artist', `%${artist}%`);
    if (city) query = query.ilike('city', `%${city}%`);
    if (genre) query = query.ilike('genre', `%${genre}%`);
    const { data, error } = await query;
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

  return (
    <>
      <Head>
        <title>Concert Buddy</title>
      </Head>
      <main className="p-6 max-w-5xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎶 Concert Buddy</h1>
          <p className="text-lg text-gray-700">Share shows, find fans, and start chatting!</p>
        </section>

        <section className="bg-white p-6 rounded shadow">
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
          <h2 className="text-xl font-semibold mb-4">🔍 Browse Posts</h2>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <input placeholder="Filter by artist" value={filters.artist} onChange={e => setFilters({ ...filters, artist: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Filter by city" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Filter by genre" value={filters.genre} onChange={e => setFilters({ ...filters, genre: e.target.value })} className="p-2 border rounded" />
          </div>
          <button onClick={fetchPosts} className="bg-gray-800 text-white px-4 py-2 rounded">Apply Filters</button>
          <div className="mt-6 space-y-4">
            {posts.length === 0 && <p className="text-gray-600">No posts found.</p>}
            {posts.map(post => (
              <div key={post.id} className="border p-4 rounded shadow bg-gray-50">
                <h3 className="text-lg font-bold">{post.artist} — {post.city}</h3>
                <p className="text-sm text-gray-600 mb-1">{post.genre} | {new Date(post.date).toLocaleDateString()}</p>
                <p>{post.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
