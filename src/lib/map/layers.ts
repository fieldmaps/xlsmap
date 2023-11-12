import { areaGeoJSON, areaProperties, map } from '$lib/stores';
import { get } from 'svelte/store';

export const addLayers = () => {
  const $map = get(map);
  const $areaGeoJSON = get(areaGeoJSON);
  const $areaProperties = get(areaProperties);
  $map.getLayer('areas-labels') && $map.removeLayer('areas-labels');
  $map.getLayer('areas-outline') && $map.removeLayer('areas-outline');
  $map.getLayer('areas') && $map.removeLayer('areas');
  $map.getSource('areas') && $map.removeSource('areas');
  $map.addSource('areas', { type: 'geojson', data: $areaGeoJSON });
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
};
