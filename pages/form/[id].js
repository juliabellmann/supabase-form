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
    baubeginn: "",
    bauende: "",
    planungsbeginn: "",
    vergabedatum: "",
    allgemeine_objektinformation: "",
    baukonstruktion: "",
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
      // if (!id) return;
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

        <StyledFieldset>
        {/* Allgemeine Angaben */}
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


          <div className="spacebetween">
            <label htmlFor="planungsbeginn">Planungsbeginn: </label>
            <input
              type="date"
              id="planungsbeginn"
              value={formData.planungsbeginn}
              onChange={e => setFormData({ ...formData, planungsbeginn: e.target.value })}
              readOnly={isReadonly}
              />
          </div>
          <div className="spacebetween">
            <label htmlFor="vergabedatum">Haupt-/Rohbauvergabe: </label>
            <input
              type="date"
              id="vergabedatum"
              value={formData.vergabedatum}
              onChange={e => setFormData({ ...formData, vergabedatum: e.target.value })}
              readOnly={isReadonly}
              />
          </div>
          <div className="spacebetween">
            <label htmlFor="baubeginn">Baubeginn: </label>
            <input
              type="date"
              id="baubeginn"
              value={formData.baubeginn}
              onChange={e => setFormData({ ...formData, baubeginn: e.target.value })}
              readOnly={isReadonly}
              />
          </div>
          <div className="spacebetween">
            <label htmlFor="bauende">Bauende: </label>
            <input
              type="date"
              id="bauende"
              value={formData.bauende}
              onChange={e => setFormData({ ...formData, bauende: e.target.value })}
              readOnly={isReadonly}
              />
          </div>

        </StyledFieldset>

        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>

        <StyledFieldset>
          <legend><h2>2. Objektbeschreibung</h2></legend>

          <div className="spacebetween">
            <label htmlFor="allgemeine_objektinformation">Allgemeine Objektinformation:</label>
            <textarea
              id="allgemeine_objektinformation"
              placeholder="Beschreibe das Objekt hier..."
              value={formData.allgemeine_objektinformation}
              onChange={e => setFormData({ ...formData, allgemeine_objektinformation: e.target.value })}
              readOnly={isReadonly}
              rows={5}
              // style={{ width: '100%' }}
            />
          </div>

          <div className="spacebetween">
            <label htmlFor="baukonstruktion">Baukonstruktion: </label>
            <textarea
              id="baukonstruktion"
              placeholder="Beschreibe das Objekt hier..."
              value={formData.baukonstruktion}
              onChange={e => setFormData({ ...formData, baukonstruktion: e.target.value })}
              readOnly={isReadonly}
              rows={5}
              // style={{ width: '100%' }}
            />
          </div>

          <div className="spacebetween">
            <label htmlFor="technische_anlagen">Technische Anlagen: </label>
            <textarea
              id="technische_anlagen"
              placeholder="Zwar wurden Varianten für die Energieversorgung berechnet,
                dennoch musste das Passivhaus an Fernwärme angeschlossen werden. Sie wird an einen gemeinsamen Speicher übergeben, an den auch Flachkollektoren angeschlossen sind. Um eine Nachrüstung von Photovoltaikelementen zu vereinfachen, wurden Leerrohre verlegt. Jede Wohnung erhielt eine Zu- und Abluftanlage mit Wärmerückgewinnung. Die Luftdichtheit der Gebäude wurde mit einem Blower-Door-Test geprüft. Die passivhaustauglichen Holz-Aluminium-Fenster mit Dreifachverglasung sind zudem hoch schalldämmend."
              value={formData.technische_anlagen}
              onChange={e => setFormData({ ...formData, technische_anlagen: e.target.value })}
              readOnly={isReadonly}
              rows={5}
              // style={{ width: '100%' }}
            />
          </div>

          <div className="spacebetween">
            <label htmlFor="beschreibung_sonstiges">Sonstiges: </label>
            <textarea
              id="beschreibung_sonstiges"
              placeholder="Der kompakte Baukörper hat eine weinrote Holzfassade und ein hellgraues Staffelgeschoss. Auf der Nordseite wurden neben den Fenstern rückseitig lackierte Gläser eingesetzt. Sie lassen die Fensterformate breiter erscheinen, während innen flexibel möbliert werden kann. Die Holzinnendecken wurden weiß lasiert. Als weiteres Gestaltungselement wurden in den Treppenaugen Regale eingebaut. Den Vorbereich prägen optisch abgetrennte Carports und ein Holzsteg unter einem Glasvordach. Der Bereich hinter dem Haus wurde mit Erde angefüllt und erhielt eine Gartenanlage mit einer Trockenmauer."
              value={formData.beschreibung_sonstiges}
              onChange={e => setFormData({ ...formData, beschreibung_sonstiges: e.target.value })}
              readOnly={isReadonly}
              rows={5}
              // style={{ width: '100%' }}
            />
          </div>

        </StyledFieldset>

        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>
        
        <StyledFieldset>
          <legend><h2>3. Kosteneinflüsse</h2></legend>

          <div>
            <label htmlFor='region'>
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
        </StyledFieldset>

        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>

        <StyledFieldset>
          <legend><h2>4. Flächen und Rauminhalte nach DIN 277:2021-08</h2></legend>
        </StyledFieldset>

        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>
        
        <StyledFieldset>
          <legend><h2>5. Kosten nach DIN 276:2018-12</h2></legend>
        </StyledFieldset>

        <StyledButton type="button" onClick={handleSave} disabled={isReadonly}>
          Zwischenspeichern
        </StyledButton>
        
        <StyledFieldset>
          <legend><h2>6. weitere Projektangaben</h2></legend>
        </StyledFieldset>
        
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
    <ToastContainer position="top-right" />
    </StyledSite>
    </>
  );
}

const StyledSite = styled.div`
 display: flex;
  flex-direction: column;
  align-items: center;
   /* background-color: rgba(198,220,225,.2);
  margin: 5rem 15rem;
  padding: 0 0 3rem 0; */
`;

const StyledFieldset = styled.fieldset`
  background-color: var(--bg-color-highlight);
  width: 1400px;

  div {
    /* Breite des Inhalts im fieldset */
    width: 50%;
  }
`;

const StyledButton = styled.button`
  background-color: #b5a286;
  color: white;
  border: none;
  padding: 10px 16px;
  margin: 2rem 1rem;
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
  background-color: #777;
  color: white;
  border: none;
  padding: 10px 16px;
  margin: 2rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;