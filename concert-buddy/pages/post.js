import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Post() {
  const [form, setForm] = useState({ artist: '', city: '', genre: '', date: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) alert('Error posting concert');
    else alert('Concert posted!');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post Your Concert Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="artist" placeholder="Artist" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="genre" placeholder="Genre" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="date" type="date" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </form>
    </div>
  );
}
