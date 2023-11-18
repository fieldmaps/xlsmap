import {
  areaGeoJSON,
  areaProperties,
  data,
  formValid,
  map,
  survey,
  vizChoice,
  vizDateField,
  vizDateFrom,
  vizDateTo,
  vizField,
  vizMethod,
} from '$lib/stores';
import { max, mean, min, rollup, sum } from 'd3-array';
import { get } from 'svelte/store';

const methods = {
  SUM: sum,
  MEAN: mean,
  MIN: min,
  MAX: max,
};

const aggGroup = (d) => {
  const $areaProperties = get(areaProperties);
  return $areaProperties.map((prop) => d[prop]).join('|');
};

const getData = () => {
  const $data = get(data);
  const $vizDateFrom = get(vizDateFrom);
  const $vizDateTo = get(vizDateTo);
  if (!$vizDateFrom && !$vizDateTo) return $data;
  const $vizDateField = get(vizDateField);
  const vizDateFromValue = new Date($vizDateFrom);
  const vizDateToValue = new Date($vizDateTo);
  return $data.filter((row) => {
    const dateFrom = $vizDateFrom ? row[$vizDateField] >= vizDateFromValue : true;
    const dateTo = $vizDateTo ? row[$vizDateField] <= vizDateToValue : true;
    return dateFrom && dateTo;
  });
};

export const setProperties = ($areaGeoJSON) => {
  const $survey = get(survey);
  const $areaProperties = get(areaProperties);
  const { properties } = $areaGeoJSON.features[0];
  if ($survey.length && !$areaProperties.length) formValid.set(true);
  areaProperties.set(Object.keys(properties));
  for (const feature of $areaGeoJSON.features)
    feature.id = Object.values(feature.properties).join('|');
  areaGeoJSON.set($areaGeoJSON);
};

export const addDataLayer = () => {
  const $vizField = get(vizField);
  const $vizMethod = get(vizMethod);
  const $vizChoice = get(vizChoice);
  if ($vizField) {
    if (!$vizMethod && !$vizChoice) {
      removeDataLayer();
      return;
    }
    const $areaGeoJSON = get(areaGeoJSON);
    const $map = get(map);
    const aggFunc = $vizChoice
      ? (v) => sum(v, (d) => (d[$vizField] === $vizChoice ? 1 : 0))
      : (v) => methods[$vizMethod](v, (d) => d[$vizField]);
    const dataAgg = rollup(getData(), aggFunc, aggGroup);
    const max = Math.max(...dataAgg.values(), 1e-99);
    const features = $areaGeoJSON.features.map((feature) => ({
      ...feature,
      properties: { ...feature.properties, dataVizValue: dataAgg.get(feature.id) ?? 0 },
    }));
    removeDataLayer();
    $map.getSource('areas')?.setData({ type: 'FeatureCollection', features });
    $map.addLayer(
      {
        id: 'areas-fill',
        source: 'areas',
        type: 'fill',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'dataVizValue'],
            0,
            '#fcfbfd',
            max,
            '#3f007d',
          ],
          'fill-opacity': 0.75,
        },
      },
      'areas-outline',
    );
  }
};

export const removeDataLayer = () => {
  const $map = get(map);
  const $areaGeoJSON = get(areaGeoJSON);
  $map.getLayer('areas-fill') && $map.removeLayer('areas-fill');
  $map.getSource('areas')?.setData($areaGeoJSON);
};
