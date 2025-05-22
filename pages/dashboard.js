// pages/dashboard.js
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [forms, setForms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getUserAndForms = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/');
        return;
      }

      setUser(user);

      const { data: formsData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (formError) {
        console.error('Fehler beim Laden der Formulare:', formError.message);
      } else {
        setForms(formsData);
      }
    };

    getUserAndForms();
  }, []);

  const handleNewForm = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session || !session.user) {
      alert("Benutzer nicht angemeldet oder keine Session vorhanden");
      console.error("Session-Fehler:", sessionError);
      return;
    }

    const userId = session.user.id;
    console.log("✅ Angemeldeter Benutzer:", userId);

    const { data, error } = await supabase
      .from("forms")
      .insert({
        user_id: userId,
        city: "",
        size: [],
        strength: null,
        status: "draft",
        // files: [],
      })
      .select()
      .single();

    if (error) {
      console.error("❌ INSERT-Fehler:", error);
      alert("Fehler beim Erstellen des Formulars");
      return;
    }

    console.log("📄 Formular erstellt:", data);
    router.push(`/form/${data.id}`);
  };

  const continueForm = (id) => {
    // Navigiere zur Formular-Seite – diese prüft selbst, ob das Formular editierbar oder readonly ist
    router.push(`/form/${id}`);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Fehler beim Abmelden');
      console.error(error);
    } else {
      // Weiterleitung zur Login-Seite
      router.push('/');
    }
  };

  return (
    <>
      <StyledDashboard>
        <StyledContainerWhite>
          <h2>Projekt liefern</h2>
          <p>Das BKI unterstützt mit seinen Baukosten-Datenbanken die Architektenschaft und alle am Bau Beteiligten bei einer qualifizierten Baukostenermittlung...</p>
          
          <StyledForms>
            <StyledButton onClick={handleNewForm}>Projekt-Veröffentlichung bis zur 1. Ebene der DIN 276_Neubau (200,-Euro)*</StyledButton>
            <StyledButton onClick={handleNewForm}>Projekt-Veröffentlichung bis zur 3. Ebene der DIN 276_Neubau(700,-Euro)*</StyledButton>
            <StyledButton onClick={handleNewForm}>Projekt-Veröffentlichung bis zur 3. Ebene der DIN 276_Altbau (700,-Euro)*</StyledButton>
            <StyledButton onClick={handleNewForm}>Projekt-Veröffentlichung bis zur 3. Ebene der DIN 276_Innenraum (400,-Euro)*</StyledButton>
            <StyledButton onClick={handleNewForm}>Projekt-Veröffentlichung bis zur 3. Ebene der DIN 276_Freianlagen (250,-Euro)*</StyledButton>
          </StyledForms>
        </StyledContainerWhite> 

        <StyledContainer>
          <h2>Bereits bearbeitete Formulare:</h2>
          {forms.length === 0 ? (
            <p>Es wurden noch keine Formulare ausgefüllt.</p>
          ) : (
            <ul>
              {forms.map((form) => (
                <StyledList key={form.id}>
                  📖
                  Objekt: {form.objektbezeichnung || 'Noch nicht angegeben'} – Status: {form.status}

                  {/* Button immer zeigen – die Formularseite erkennt automatisch, ob es bearbeitbar ist */}
                  <StyledButton onClick={() => continueForm(form.id)}>
                    {form.status === 'draft' ? 'Weiter bearbeiten' : 'Ansehen'}
                  </StyledButton>
                </StyledList>
              ))}
            </ul>
          )}
        </StyledContainer>

        {/* Logout-Button */}
        <StyledButton onClick={handleLogout}>Abmelden</StyledButton>
      </StyledDashboard>
    </>
  );
}

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledContainerWhite = styled.div`
  margin: 2rem 0;
  padding: 1rem 25rem 3rem 25rem;
`;

const StyledButton = styled.button`
  background-color: #b5a286;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #b5a286;
    text-decoration: underline;
  }
`;

const StyledForms = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledContainer = styled.div`
  background-color: var(--bg-color-highlight);
  margin: 2rem 0;
  padding: 1rem 25rem 3rem 25rem;

  h2 {
    margin: 3rem 0;
  }
`;

const StyledList = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  height: 50px;
`;
