import { authorize, readFile } from '$lib/utils';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  const { buffer, headers } = await readFile(`${params.slug}/areas.geojson`);
  return new Response(buffer, { headers });
}
