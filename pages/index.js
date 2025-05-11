/// pages/index.js
import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) alert('Registrierung erfolgreich!');
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Einloggen</button>

      <hr />
      <h2>Registrieren</h2>
      <button onClick={handleRegister}>Registrieren</button>
    </div>
  );
}