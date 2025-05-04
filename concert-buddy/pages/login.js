import { supabase } from '../lib/supabase';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert('Login error');
    else alert('Check your email for login link');
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login or Signup</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Send Magic Link</button>
      </form>
    </div>
  );
}
