import { addEvents } from '$lib/map/events';
import { addLayers } from '$lib/map/layers';
import { areaGeoJSON, map } from '$lib/stores';
import bbox from '@turf/bbox';
import type { LngLatBoundsLike } from 'maplibre-gl';
import { get } from 'svelte/store';

function setBounds() {
  const $map = get(map);
  const $areaGeoJSON = get(areaGeoJSON);
  const bounds = bbox($areaGeoJSON);
  const lngLatBounds: LngLatBoundsLike = [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
  $map.fitBounds(lngLatBounds, { padding: 10, maxZoom: 16 });
}

export function initMap() {
  setBounds();
  addLayers();
  addEvents();
}
