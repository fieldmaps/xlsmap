import { page } from '$app/stores';
import { PUBLIC_DATA } from '$env/static/public';
import { loadForm } from '$lib/data/load';
import { initMap } from '$lib/map/init';
import { areaGeoJSON } from '$lib/stores';
import { get } from 'svelte/store';

export const fetchAreas = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const geojsonURL = `${PUBLIC_DATA}/${slug}/areas.geojson`;
  const response = await fetch(geojsonURL);
  const geojson = await response.json();
  areaGeoJSON.set(geojson);
  initMap();
};

export const fetchForm = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const res = await fetch(`${PUBLIC_DATA}/${slug}/form.xlsx`);
  const file = await res.arrayBuffer();
  await loadForm(file);
};
