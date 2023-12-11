import { authorize, readFile } from '$lib/utils';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  const blob = await readFile(`${params.slug}/areas.geojson`);
  return new Response(blob);
}
