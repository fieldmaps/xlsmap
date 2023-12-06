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

const isDateField = ({ type }: { type: string }) => type === 'date';

export const loadData = async (file: ArrayBuffer) => {
  activeIndex.set(-1);
  formValid.set(true);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  const rows = await excelToJSON(workbook);
  data.set(rows);
};

export const loadDataFile = async (e: Event) => {
  const buffer = await fileToBuffer(e.target.files[0]);
  loadData(buffer);
};

const setDefaultDateField = () => {
  const dateFields = get(survey).filter(isDateField);
  if (dateFields.length) vizDateField.set(dateFields[0].name);
};

export const loadForm = async (file: ArrayBuffer) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  if (get(areaProperties).length && !get(survey).length) formValid.set(true);
  survey.set(await excelToJSON(workbook, 'survey'));
  choices.set(await excelToJSON(workbook, 'choices'));
  setDefaultDateField();
};

export const loadGeoJSON = ($areaGeoJSON) => {
  const { properties } = $areaGeoJSON.features[0];
  if (get(survey).length && !get(areaProperties).length) formValid.set(true);
  areaProperties.set(Object.keys(properties));
  for (const feature of $areaGeoJSON.features)
    feature.id = Object.values(feature.properties).join('|');
  areaGeoJSON.set($areaGeoJSON);
};
