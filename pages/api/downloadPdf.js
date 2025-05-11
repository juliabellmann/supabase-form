/// pages/api/downloadPdf.js
import PDFDocument from 'pdfkit';
import supabase from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query;
  const { data: form } = await supabase.from('forms').select('*').eq('id', id).single();

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=formular_${id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('Formular', { underline: true });
  doc.moveDown();
  doc.text(`Stadt: ${form.city}`);
  doc.text(`Größe: ${form.size.join(', ')}`);
  doc.text(`Stärke: ${form.strength}`);
  doc.text(`Status: ${form.status}`);

  doc.end();
}
