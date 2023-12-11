import { authorize, readFile, updateFile } from '$lib/utils';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  const blob = await readFile(`${params.slug}/data.xlsx`);
  return new Response(blob);
}

export async function PUT({ params, request }) {
  authorize(request.headers, params.slug);
  const body = await request.blob();
  const today = new Date().toISOString().split('T')[0];
  await updateFile(`${params.slug}/data.xlsx`, body);
  await updateFile(`${params.slug}/data/data_${today}.xlsx`, body);
  return new Response();
}
