import manifest from '$lib/manifest.json';

export function GET() {
  return new Response(JSON.stringify(manifest));
}
