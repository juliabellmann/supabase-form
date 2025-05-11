/// pages/form/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

export default function Form() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    city: '',
    size: [],
    strength: '',
    files: [],
    status: 'draft',
    objektbezeichnung: '', 
  });

  useEffect(() => {
    if (id && id !== 'new') {
      supabase.from('forms').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setFormData(data);
      });
    }
  }, [id]);

  const handleSave = async () => {
    const user = await supabase.auth.getUser();
    const data = { ...formData, user_id: user.data.user.id, status: 'draft' };

    if (id === 'new') {
      await supabase.from('forms').insert(data);
    } else {
      await supabase.from('forms').update(data).eq('id', id);
    }

    router.push('/dashboard');
  };

  const handleSubmit = async () => {
    await supabase.from('forms').update({ ...formData, status: 'submitted' }).eq('id', id);
    router.push('/dashboard');
  };

  const toggleSize = (val) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.includes(val) ? prev.size.filter(s => s !== val) : [...prev.size, val]
    }));
  };

  return (
    <div>
      <input placeholder="Objektbezeichnung" value={formData.objektbezeichnung} onChange={e => setFormData({ ...formData, objektbezeichnung: e.target.value })} />
      <input placeholder="Stadt" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
      <div>
        <label><input type="checkbox" onChange={() => toggleSize('klein')} checked={formData.size.includes('klein')} /> klein</label>
        <label><input type="checkbox" onChange={() => toggleSize('mittel')} checked={formData.size.includes('mittel')} /> mittel</label>
        <label><input type="checkbox" onChange={() => toggleSize('groß')} checked={formData.size.includes('groß')} /> groß</label>
      </div>
      <div>
        <label><input type="radio" name="strength" value="stark" onChange={e => setFormData({ ...formData, strength: e.target.value })} /> stark</label>
        <label><input type="radio" name="strength" value="mittel" onChange={e => setFormData({ ...formData, strength: e.target.value })} /> mittel</label>
        <label><input type="radio" name="strength" value="schwach" onChange={e => setFormData({ ...formData, strength: e.target.value })} /> schwach</label>
      </div>

      <button onClick={handleSave}>Zwischenspeichern</button>
      <button onClick={handleSubmit}>Absenden</button>
    </div>
  );
}