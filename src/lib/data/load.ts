import { excelToJSON, fileToBuffer } from '$lib/data/convert';
import {
  activeIndex,
  areaGeoJSON,
  areaProperties,
  choices,
  data,
  formValid,
  survey,
} from '$lib/stores';
import Excel from 'exceljs';
import { get } from 'svelte/store';

export const loadData = async (e: Event) => {
  activeIndex.set(-1);
  formValid.set(true);
  const buffer = await fileToBuffer(e.target.files[0]);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  const rows = await excelToJSON(workbook);
  data.set(rows);
};

export const loadForm = async (file: ArrayBuffer) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  if (get(areaProperties).length && !get(survey).length) formValid.set(true);
  survey.set(await excelToJSON(workbook, 'survey'));
  choices.set(await excelToJSON(workbook, 'choices'));
};

export const loadGeoJSON = ($areaGeoJSON) => {
  const { properties } = $areaGeoJSON.features[0];
  if (get(survey).length && !get(areaProperties).length) formValid.set(true);
  areaProperties.set(Object.keys(properties));
  for (const feature of $areaGeoJSON.features)
    feature.id = Object.values(feature.properties).join('|');
  areaGeoJSON.set($areaGeoJSON);
};
