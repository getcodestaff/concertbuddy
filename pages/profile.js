import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ username: '', bio: '', genres: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id);
    });
  }, []);

  const fetchProfile = async (id) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) console.error(error);
    else setProfile(data);
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    const updates = {
      id: user.id,
      username: profile.username,
      bio: profile.bio,
      genres: profile.genres,
      updated_at: new Date(),
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <label className="block mb-2">Username</label>
          <input
            className="w-full p-2 border rounded mb-4"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <label className="block mb-2">Bio</label>
          <textarea
            className="w-full p-2 border rounded mb-4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <label className="block mb-2">Favorite Genres</label>
          <input
            className="w-full p-2 border rounded mb-4"
            value={profile.genres}
            onChange={(e) => setProfile({ ...profile, genres: e.target.value })}
          />
          <button onClick={saveProfile} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </>
      )}
    </div>
  );
}
