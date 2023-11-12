import { toJSON, toXLSX } from '$lib/excel';
import { activeIndex, data, formValid, map } from '$lib/stores';
import Excel from 'exceljs';
import { get } from 'svelte/store';

const getDate = () =>
  new Date()
    .toISOString()
    .replace(/[^a-z0-9]/gi, '_')
    .slice(0, -5);

const readFile = (file: File): Promise<Buffer> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

export const importData = async (e: Event) => {
  activeIndex.set(-1);
  formValid.set(true);
  const file = await readFile(e.target.files[0]);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  const rows = await toJSON(workbook);
  data.set(rows);
};

export const exportData = async () => {
  const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const $data = get(data);
  const file = new Blob([await toXLSX($data)], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = `data_${getDate()}.xlsx`;
  a.click();
};

export const exportScreenshot = () => {
  const $map = get(map);
  const a = document.createElement('a');
  a.href = $map.getCanvas().toDataURL();
  a.download = `map_${getDate()}.png`;
  a.click();
};
