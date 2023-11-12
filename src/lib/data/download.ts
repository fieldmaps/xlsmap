import { jsonToExcel } from '$lib/data/convert';
import { data, map } from '$lib/stores';
import { get } from 'svelte/store';

const re = /[^a-z0-9]/gi;
const getDate = () => new Date().toISOString().replace(re, '_').slice(0, -5);

export const downloadData = async () => {
  const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const $data = get(data);
  const file = new Blob([await jsonToExcel($data)], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = `data_${getDate()}.xlsx`;
  a.click();
};

export const downloadScreenshot = () => {
  const $map = get(map);
  const a = document.createElement('a');
  a.href = $map.getCanvas().toDataURL();
  a.download = `map_${getDate()}.png`;
  a.click();
};
