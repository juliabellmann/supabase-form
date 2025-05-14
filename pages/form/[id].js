/// pages/form/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import styled from 'styled-components';

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
    <StyledSite>
      <h1>Formular</h1>
      <form>

      <fieldset>
        <legend><h2>1. Allgemeine Angaben</h2></legend>

        <div className="spacebetween">
          <label for="objektbezeichnung">Objektbezeichnung: </label>
          <input id="objektbezeichnung" placeholder="Objektbezeichnung" value={formData.objektbezeichnung} onChange={e => setFormData({ ...formData, objektbezeichnung: e.target.value })} />
        </div>

        <div className="spacebetween">
          <label for="city">Stadt: </label>
          <input id="city" placeholder="Stadt" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
        </div>

      </fieldset>

      <fieldset>
        <legend><h2>2. Objektbeschreibung</h2></legend>

        <div>
          <label><input type="checkbox" onChange={() => toggleSize('klein')} checked={formData.size.includes('klein')} /> klein</label>
          <label><input type="checkbox" onChange={() => toggleSize('mittel')} checked={formData.size.includes('mittel')} /> mittel</label>
          <label><input type="checkbox" onChange={() => toggleSize('groß')} checked={formData.size.includes('groß')} /> groß</label>
        </div>
        <div>
          <label><input type="radio" name="strength" value="stark" checked={formData.strength === 'stark'} onChange={e => setFormData({ ...formData, strength: e.target.value })} /> stark</label>
          <label><input type="radio" name="strength" value="mittel" onChange={e => setFormData({ ...formData, strength: e.target.value })} /> mittel</label>
          <label><input type="radio" name="strength" value="schwach" onChange={e => setFormData({ ...formData, strength: e.target.value })} /> schwach</label>
        </div>
      </fieldset>

      <StyledButton type="button" onClick={handleSave}>Zwischenspeichern</StyledButton>
      <StyledButton type="button" onClick={handleSubmit}>Absenden</StyledButton>
      </form>
    </StyledSite>
  );
}

const StyledSite = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
background-color: rgba(198,220,225,.2);
margin: 5rem 15rem;
padding: 0 0 3rem 0;
`;

const StyledButton = styled.button`
  background-color: #b5a286;
  color: white;
  border: none;
  padding: 10px 16px;
  margin-top: 10px;
  /* border-radius: 4px; */
  cursor: pointer;

  &:hover {
    background-color: #b5a286;
    text-decoration: underline;
  }
`;