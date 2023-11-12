import manifest from '$lib/manifest.json';

export function GET({ url }) {
  manifest.name = `XLSMap - ${url.pathname.substring(1).toLocaleUpperCase()}`;
  manifest.start_url = url.pathname;
  return new Response(JSON.stringify(manifest));
}
