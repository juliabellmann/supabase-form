/// pages/form/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import styled from 'styled-components';
// npm install react-toastify
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form() {
  const router = useRouter();
  const { id } = router.query;

// hier das neue Formularfeld ergänzen
  const [formData, setFormData] = useState({
    city: '',
    size: [],
    strength: '',
    files: [],
    status: 'draft',
    objektbezeichnung: '', 
  });

  const [isReadonly, setIsReadonly] = useState(false); // ⬅️ Zustand zum Sperren des Formulars

  useEffect(() => {
    if (id && id !== 'new') {
      supabase.from('forms').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setFormData(data);

          // ⬇️ Wenn das Formular eingereicht wurde, Formular schreibschützen
          if (data.status === 'submitted') {
            setIsReadonly(true);
          }
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (isReadonly) return; // ⛔ Änderungen blockieren, wenn Formular readonly ist

    const user = await supabase.auth.getUser();
    const data = { ...formData, user_id: user.data.user.id, status: 'draft' };

    // Bedingungen / Abfrage für toast-Message
try {
    if (id === 'new') {
      await supabase.from('forms').insert(data);
      toast.success("Formular erfolgreich zwischengespeichert!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      await supabase.from('forms').update(data).eq('id', id);
      toast.success("Änderungen wurden gespeichert.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  } catch (error) {
    toast.error("Beim Speichern ist ein Fehler aufgetreten.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  };

  const handleSubmit = async () => {
    if (isReadonly) return; // ⛔ Einreichen blockieren, wenn bereits submitted

    await supabase.from('forms').update({ ...formData, status: 'submitted' }).eq('id', id);
    router.push('/dashboard');
  };

  const toggleSize = (val) => {
    if (isReadonly) return; // ⛔ Keine Auswahländerung bei readonly
    setFormData(prev => ({
      ...prev,
      size: prev.size.includes(val) ? prev.size.filter(s => s !== val) : [...prev.size, val]
    }));
  };

  // const [isDownloading, setIsDownloading] = useState(false);
  
    // PDF Download Funktion
  const downloadPdf = () => {
      if (!id) return;
    // öffnet die API-Route zum Herunterladen der PDF
    window.open(`/api/downloadPdf?id=${id}`, '_blank');
  };

  return (
      <>
    <StyledSite>
      <h1>Formular</h1>

      {/* Hinweis bei gesperrtem Formular */}
      {isReadonly && (
        <p style={{ backgroundColor: '#eee', padding: '1rem', marginBottom: '1rem' }}>
          Dieses Formular wurde bereits eingereicht und ist nicht mehr bearbeitbar.
        </p>
      )}

      <form>
        <fieldset>
          <legend><h2>1. Allgemeine Angaben</h2></legend>

          <div className="spacebetween">
            <label htmlFor="objektbezeichnung">Objektbezeichnung: </label>
            <input
              id="objektbezeichnung"
              placeholder="Objektbezeichnung"
              value={formData.objektbezeichnung}
              onChange={e => setFormData({ ...formData, objektbezeichnung: e.target.value })}
              readOnly={isReadonly}
            />
          </div>

          <div className="spacebetween">
            <label htmlFor="city">Stadt: </label>
            <input
              id="city"
              placeholder="Stadt"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              readOnly={isReadonly}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend><h2>2. Objektbeschreibung</h2></legend>

          <div>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleSize('klein')}
                checked={formData.size.includes('klein')}
                disabled={isReadonly}
              /> klein
            </label>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleSize('mittel')}
                checked={formData.size.includes('mittel')}
                disabled={isReadonly}
              /> mittel
            </label>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleSize('groß')}
                checked={formData.size.includes('groß')}
                disabled={isReadonly}
              /> groß
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="strength"
                value="stark"
                checked={formData.strength === 'stark'}
                onChange={e => setFormData({ ...formData, strength: e.target.value })}
                disabled={isReadonly}
              /> stark
            </label>
            <label>
              <input
                type="radio"
                name="strength"
                value="mittel"
                checked={formData.strength === 'mittel'}
                onChange={e => setFormData({ ...formData, strength: e.target.value })}
                disabled={isReadonly}
              /> mittel
            </label>
            <label>
              <input
                type="radio"
                name="strength"
                value="schwach"
                checked={formData.strength === 'schwach'}
                onChange={e => setFormData({ ...formData, strength: e.target.value })}
                disabled={isReadonly}
              /> schwach
            </label>
          </div>
        </fieldset>

        {/* Buttons deaktivieren, wenn readonly */}
        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>
              <StyledButton type="button" onClick={() => router.push('/dashboard')}>
        Zurück zur Übersicht
      </StyledButton>
        <StyledButton type="button" onClick={handleSubmit} disabled={isReadonly}>
          Absenden
        </StyledButton>
      </form>

          {/* ⬇️ Zurück-Button nur im readonly-Modus */}
    {isReadonly && (
    <>
      <StyledBackButton type="button" onClick={() => router.push('/dashboard')}>
        Zurück zur Übersicht
      </StyledBackButton>
      <StyledButton type="button" onClick={downloadPdf}>
        PDF herunterladen
      </StyledButton>
    </>
    )}
    </StyledSite>
    <ToastContainer position="top-right" />
    </>
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
  cursor: pointer;

  &:hover {
    background-color: #b5a286;
    text-decoration: underline;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    text-decoration: none;
  }
`;
const StyledBackButton = styled.button`
  margin-top: 2rem;
  background-color: #777;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;