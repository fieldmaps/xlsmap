import { page } from '$app/stores';
import { PUBLIC_DATA } from '$env/static/public';
import { jsonToExcel } from '$lib/data/convert';
import { loadData, loadForm, loadGeoJSON } from '$lib/data/load';
import { initMap } from '$lib/map/init';
import { data, dataOnCloud } from '$lib/stores';
import { get } from 'svelte/store';

export async function fetchAreas() {
  const $page = get(page);
  const { slug } = $page.params;
  const geojsonURL = `${PUBLIC_DATA}/${slug}/areas.geojson`;
  const response = await fetch(geojsonURL);
  const geojson = await response.json();
  loadGeoJSON(geojson);
  initMap();
}

async function fetchForm() {
  const $page = get(page);
  const { slug } = $page.params;
  const res = await fetch(`${PUBLIC_DATA}/${slug}/form.xlsx`);
  const file = await res.arrayBuffer();
  await loadForm(file);
}

export async function fetchData() {
  const $page = get(page);
  const { slug } = $page.params;
  const res = await fetch(`${PUBLIC_DATA}/${slug}/data.xlsx`);
  if (res.ok) {
    const file = await res.arrayBuffer();
    await loadData(file);
    const cloudOnly = await fetch(`${PUBLIC_DATA}/${slug}/data`);
    if (cloudOnly.ok) dataOnCloud.set(true);
  }
}

export async function putData() {
  const $page = get(page);
  const { slug } = $page.params;
  const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const $data = get(data);
  const file = new Blob([await jsonToExcel($data)], { type: mimeType });
  const formData = new FormData();
  formData.append('file', file);
  const options = { method: 'PUT', body: formData };
  await fetch(`${PUBLIC_DATA}/${slug}/data.xlsx`, options);
}

export function fetchExcel() {
  fetchForm();
  fetchData();
}
