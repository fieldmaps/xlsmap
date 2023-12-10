import { jsonToExcel } from '$lib/data/convert';
import { data, map } from '$lib/stores';
import { toPng } from 'html-to-image';
import mergeImages from 'merge-images';
import { get } from 'svelte/store';

const re = /[^a-z0-9]/gi;

function getDate() {
  return new Date().toISOString().replace(re, '_').slice(0, -5);
}

function getImage(dataURL: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataURL;
  });
}

export async function downloadData() {
  const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const $data = get(data);
  const file = new Blob([await jsonToExcel($data)], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = `data_${getDate()}.xlsx`;
  a.click();
}

export async function downloadMap() {
  const $map = get(map);
  const mapCanvas = $map.getCanvas();
  const mapPng = mapCanvas.toDataURL();
  const legendPng = await toPng(document.getElementById('map-legend'));
  const { height } = await getImage(legendPng);
  const a = document.createElement('a');
  a.href = await mergeImages([
    mapPng,
    { src: legendPng, x: 10, y: mapCanvas.height - height - 10 },
  ]);
  a.download = `map_${getDate()}.png`;
  a.click();
}

export function downloadChart() {
  const a = document.createElement('a');
  a.href = document.getElementById('viz').children[0].toDataURL();
  a.download = `chart_${getDate()}.png`;
  a.click();
}
