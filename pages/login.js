import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // ✅ Safe profile creation if not exists
        await supabase.from('profiles').upsert({
          id: user.id,
          username: user.email.split('@')[0]
        });
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the magic link!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow rounded p-6">
      <h2 className="text-xl font-bold mb-4">🔐 Log in with Magic Link</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Send Magic Link
        </button>
      </form>
      {user && (
        <p className="mt-4 text-green-700">✅ Logged in as {user.email}</p>
      )}
    </div>
  );
}
