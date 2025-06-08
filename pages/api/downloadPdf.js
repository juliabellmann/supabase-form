import PDFDocument from 'pdfkit';
import supabase from '../../lib/supabaseClient';


export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    res.status(400).json({ error: 'Formular-ID fehlt' });
    return;
  }

  // Formular aus DB laden
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !form) {
    res.status(404).json({ error: 'Formular nicht gefunden' });
    return;
  }

  // PDF generieren
  const doc = new PDFDocument();

  // Headers setzen, um Download zu triggern
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=formular_${id}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text('Formular', { underline: true });
  doc.moveDown();

  doc.fontSize(14).text(`Stadt: ${form.city || '-'}`);
  doc.text(`Größe: ${Array.isArray(form.size) ? form.size.join(', ') : '-'}`);
  doc.text(`Stärke: ${form.strength || '-'}`);
  doc.text(`Status: ${form.status || '-'}`);

  doc.end();
}
