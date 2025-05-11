/// pages/admin.js
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Admin() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData?.role === 'reader') {
        const { data } = await supabase.from('forms').select('*');
        setForms(data);
      }
    });
  }, []);

  return (
    <div>
      <h1>Alle Formulare</h1>
      {forms.map(f => (
        <div key={f.id}>
          <p>Stadt: {f.city}</p>
          <p>Status: {f.status}</p>
        </div>
      ))}
    </div>
  );
}