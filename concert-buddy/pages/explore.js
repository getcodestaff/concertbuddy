import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Explore() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('date');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Explore Concert Plans</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <h3 className="font-semibold text-lg">{post.artist} - {post.city}</h3>
            <p>{post.genre} | {new Date(post.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
