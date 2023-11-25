import { addHoverEvents, removeHoverEvents } from '$lib/map/events';
import {
  areaGeoJSON,
  areaProperties,
  data,
  formValid,
  map,
  survey,
  vizChoice,
  vizDataType,
  vizDateField,
  vizDateFrom,
  vizDateTo,
  vizField,
  vizHover,
  vizMax,
  vizMethod,
  vizNumerical,
  vizVisable,
} from '$lib/stores';
import { max, mean, min, rollup, sum } from 'd3-array';
import { get } from 'svelte/store';

const methods = {
  Sum: sum,
  Mean: mean,
  Min: min,
  Max: max,
};

const aggGroup = (d) => {
  const $areaProperties = get(areaProperties);
  return $areaProperties.map((prop) => d[prop]).join('|');
};

const getDateFilteredData = () => {
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

const aggregate = (filteredData) => {
  const $vizDataType = get(vizDataType);
  const $vizField = get(vizField);
  const $vizChoice = get(vizChoice);
  const $vizMethod = get(vizMethod);
  const $vizNumerical = get(vizNumerical);
  if ($vizDataType === 'CATEGORICAL') {
    const aggFunc = (v) => sum(v, (d) => ($vizChoice.includes(d[$vizField]) ? 1 : 0));
    return rollup(filteredData, aggFunc, aggGroup);
  } else {
    const longData = filteredData.flatMap((d) =>
      $vizNumerical.map((n) => ({ ...d, dataVizValue: d[n] })),
    );
    const aggFunc = (v) => methods[$vizMethod](v, (d) => d.dataVizValue);
    return rollup(longData, aggFunc, aggGroup);
  }
};

export const addDataLayer = () => {
  const $vizChoice = get(vizChoice);
  const $vizNumerical = get(vizNumerical);
  const filteredData = getDateFilteredData();
  if ((!$vizNumerical.length && !$vizChoice.length) || !filteredData.length) {
    removeDataLayer();
    return;
  }
  const $areaGeoJSON = get(areaGeoJSON);
  const $map = get(map);
  const dataAgg = aggregate(filteredData);
  const max = Math.max(...dataAgg.values(), 1e-99);
  vizMax.set(max);
  const features = $areaGeoJSON.features.map((feature) => ({
    ...feature,
    properties: { ...feature.properties, dataVizValue: dataAgg.get(feature.id) ?? 0 },
  }));
  removeDataLayer();
  vizVisable.set(true);
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
      },
    },
    'areas-outline',
  );
  addHoverEvents();
};

export const removeDataLayer = () => {
  removeHoverEvents();
  const $map = get(map);
  const $areaGeoJSON = get(areaGeoJSON);
  $map.getLayer('areas-fill') && $map.removeLayer('areas-fill');
  $map.getSource('areas')?.setData($areaGeoJSON);
  vizVisable.set(false);
  vizHover.set({});
};
