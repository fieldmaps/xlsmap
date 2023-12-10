// import { authorize, readFile } from '$lib/utils';

export async function GET({ params, request }) {
  // authorize(request.headers, params.slug);
  // const stream = await readFile(`${params.slug}/areas.geojson`);
  // return new Response(stream);
  return new Response('test');
}
