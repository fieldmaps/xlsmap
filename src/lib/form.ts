import { page } from '$app/stores';
import { PUBLIC_DATA } from '$env/static/public';
import { areaProperties, choices, survey } from '$lib/stores';
import Excel from 'exceljs';
import Papa from 'papaparse';
import { get } from 'svelte/store';

const config = { header: true, dynamicTyping: true, skipEmptyLines: true };

const toJSON = async (workbook: Excel.Workbook, sheetName: string) => {
  const buffer = await workbook.csv.writeBuffer({ sheetName });
  return Papa.parse(buffer.toString(), config).data;
};

export const importForm = async () => {
  const $page = get(page);
  const { slug } = $page.params;
  const res = await fetch(`${PUBLIC_DATA}/${slug}/form.xlsx`);
  const file = await res.arrayBuffer();
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  survey.set(await toJSON(workbook, 'survey'));
  choices.set(await toJSON(workbook, 'choices'));
};

export const getEmptyRow = () => {
  const $areaProperties = get(areaProperties);
  const $survey = get(survey);
  const row = {};
  for (const key of $areaProperties) row[key] = null;
  for (const survey of $survey) row[survey.name] = survey.default;
  return row;
};
