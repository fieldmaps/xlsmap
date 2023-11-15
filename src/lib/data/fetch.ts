import { page } from '$app/stores';
import { PUBLIC_DATA } from '$env/static/public';
import { loadForm, loadGeoJSON } from '$lib/data/load';
import { initMap } from '$lib/map/init';
import { get } from 'svelte/store';

export const fetchAreas = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const geojsonURL = `${PUBLIC_DATA}/${slug}/areas.geojson`;
  const response = await fetch(geojsonURL);
  const geojson = await response.json();
  loadGeoJSON(geojson);
  initMap();
};

export const fetchForm = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const res = await fetch(`${PUBLIC_DATA}/${slug}/form.xlsx`);
  const file = await res.arrayBuffer();
  await loadForm(file);
};
