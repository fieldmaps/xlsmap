import { page } from '$app/stores';
import { PUBLIC_DATA } from '$env/static/public';
import { addEvents } from '$lib/events';
import { areaProperties, map } from '$lib/stores';
import bbox from '@turf/bbox';
import { get } from 'svelte/store';

export const setBounds = async (geojsonURL: string) => {
  const $map = get(map);
  const response = await fetch(geojsonURL);
  const geojson = await response.json();
  const bounds = bbox(geojson);
  $map.fitBounds(
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    { padding: 10, maxZoom: 16 },
  );
  areaProperties.set(Object.keys(geojson.features[0].properties));
};

export const init = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const geojsonURL = `${PUBLIC_DATA}/${slug}/areas.geojson`;
  await setBounds(geojsonURL);
  const $map = get(map);
  const $areaProperties = get(areaProperties);
  $map.addSource('areas', { type: 'geojson', data: geojsonURL });
  $map.addLayer({
    id: 'areas',
    source: 'areas',
    type: 'fill',
    paint: { 'fill-opacity': 0 },
  });
  $map.addLayer({
    id: 'areas-outline',
    source: 'areas',
    type: 'line',
    paint: { 'line-color': 'black' },
  });
  $map.addLayer({
    id: 'areas-labels',
    source: 'areas',
    type: 'symbol',
    paint: {
      'text-halo-blur': 1,
      'text-halo-color': 'white',
      'text-halo-width': 2,
    },
    layout: {
      'text-field': ['get', $areaProperties[0]],
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
    },
  });
  addEvents();
};
