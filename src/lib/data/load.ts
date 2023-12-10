import { excelToJSON, fileToBuffer } from '$lib/data/convert';
import {
  activeIndex,
  areaGeoJSON,
  areaProperties,
  choices,
  data,
  formValid,
  survey,
  vizDateField,
} from '$lib/stores';
import Excel from 'exceljs';
import { get } from 'svelte/store';

function isDateField({ type }: { type: string }) {
  return type === 'date';
}

export async function loadData(file: ArrayBuffer) {
  activeIndex.set(-1);
  formValid.set(true);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  const rows = await excelToJSON(workbook);
  data.set(rows);
}

export async function loadDataFile(e: Event) {
  const buffer = await fileToBuffer(e.target.files[0]);
  loadData(buffer);
}

function setDefaultDateField() {
  const dateFields = get(survey).filter(isDateField);
  if (dateFields.length) vizDateField.set(dateFields[0].name);
}

export async function loadForm(file: ArrayBuffer) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  if (get(areaProperties).length && !get(survey).length) formValid.set(true);
  survey.set(await excelToJSON(workbook, 'survey'));
  choices.set(await excelToJSON(workbook, 'choices'));
  setDefaultDateField();
}

export function loadGeoJSON($areaGeoJSON) {
  const { properties } = $areaGeoJSON.features[0];
  if (get(survey).length && !get(areaProperties).length) formValid.set(true);
  areaProperties.set(Object.keys(properties));
  for (const feature of $areaGeoJSON.features)
    feature.id = Object.values(feature.properties).join('|');
  areaGeoJSON.set($areaGeoJSON);
}
