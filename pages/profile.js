import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', bio: '', genres: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadProfile(data.user.id);
      }
    });
  }, []);

  const loadProfile = async (id) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) {
      setProfile(data);
    }
  };

  const saveProfile = async () => {
    const updates = { ...profile, id: user.id, updated_at: new Date() };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('Profile saved!');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <input
        placeholder="Username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        className="block w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        className="block w-full p-2 mb-4 border rounded"
      />
      <input
        placeholder="Genres (comma-separated)"
        value={profile.genres}
        onChange={(e) => setProfile({ ...profile, genres: e.target.value })}
        className="block w-full p-2 mb-4 border rounded"
      />
      <button onClick={saveProfile} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  );
}
