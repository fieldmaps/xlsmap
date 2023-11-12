export function GET({ url }) {
  const manifest = {
    background_color: 'hsl(0, 0%, 10%)',
    description: 'Geo data collection and visualization tool using the XLSForm standard.',
    display: 'standalone',
    lang: 'en-GB',
    name: `XLSMap - ${url.pathname.substring(1).toLocaleUpperCase()}`,
    orientation: 'portrait',
    short_name: 'XLSMap',
    start_url: url.pathname,
    theme_color: 'hsl(0, 0%, 10%)',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon_maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot_narrow.png',
        sizes: '768x1366',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot_wide.png',
        sizes: '1366x768',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  };
  return new Response(JSON.stringify(manifest));
}
