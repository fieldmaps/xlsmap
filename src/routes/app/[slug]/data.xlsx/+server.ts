import { authorize, readFile, updateFile } from '../utils.js';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  const stream = await readFile(`${params.slug}/data.xlsx`);
  return new Response(stream);
}

export async function PUT({ params, request }) {
  authorize(request.headers, params.slug);
  const data = await request.formData();
  const file = data.get('file') as File;
  const buffer = await file.arrayBuffer();
  const today = new Date().toISOString().split('T')[0];
  await updateFile(`${params.slug}/data.xlsx`, buffer, file.type);
  await updateFile(`${params.slug}/data/data_${today}.xlsx`, buffer, file.type);
  return new Response();
}
