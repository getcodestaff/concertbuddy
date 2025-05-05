import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the login link!');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Login with Magic Link</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded">
          Send Magic Link
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
