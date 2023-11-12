import { addEvents } from '$lib/map/events';
import { addLayers } from '$lib/map/layers';
import { areaGeoJSON, areaProperties, formValid, map, survey } from '$lib/stores';
import bbox from '@turf/bbox';
import type { LngLatBoundsLike } from 'maplibre-gl';
import { get } from 'svelte/store';

const setProperties = () => {
  const { properties } = get(areaGeoJSON).features[0];
  if (get(survey).length && !get(areaProperties).length) formValid.set(true);
  areaProperties.set(Object.keys(properties));
};

const setBounds = () => {
  const $map = get(map);
  const $areaGeoJSON = get(areaGeoJSON);
  const bounds = bbox($areaGeoJSON);
  const lngLatBounds: LngLatBoundsLike = [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
  $map.fitBounds(lngLatBounds, { padding: 10, maxZoom: 16 });
};

export const initMap = () => {
  setProperties();
  setBounds();
  addLayers();
  addEvents();
};
