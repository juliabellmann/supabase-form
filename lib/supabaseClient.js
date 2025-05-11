/// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sfedmadurrsugfjogqbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZWRtYWR1cnJzdWdmam9ncWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTAwNTAsImV4cCI6MjA2MjQ4NjA1MH0.I52HFb8vzgmp4JVit1aQN7Ftlz4gxksgHPZdvlsCWrk'
);

export default supabase;