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
      files: [],
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
    <div>
      <h1>Willkommen {user?.email}</h1>

      <StyledButton onClick={handleNewForm}>Neues Formular erstellen</StyledButton>

      <h2>Deine Formulare:</h2>
      {forms.length === 0 ? (
        <p>Du hast noch keine Formulare.</p>
      ) : (
        <ul>
          {forms.map((form) => (
            <li key={form.id}>
              Objekt: {form.objektbezeichnung || 'Noch nicht angegeben'} – Status: {form.status}
              {form.status === 'draft' && (
                <StyledButton onClick={() => continueForm(form.id)}>Weiter bearbeiten</StyledButton>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Logout-Button */}
      <StyledButton onClick={handleLogout}>Abmelden</StyledButton>
    </div>
  );
}
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