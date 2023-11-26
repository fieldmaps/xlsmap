import { addChart } from '$lib/data/chart';
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
  vizDisplayType,
  vizField,
  vizFilterArea,
  vizFilters,
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
  const $vizFilters = get(vizFilters);
  const $vizFilterArea = get(vizFilterArea);
  const $vizDataType = get(vizDataType);
  const $vizDateFrom = get(vizDateFrom);
  const $vizDateTo = get(vizDateTo);
  if (!$vizDateFrom && !$vizDateTo && !$vizFilters.length && !$vizFilterArea.length) return $data;
  const $vizDateField = get(vizDateField);
  const $vizChoice = get(vizChoice);
  const $vizField = get(vizField);
  const vizDateFromValue = new Date($vizDateFrom);
  const vizDateToValue = new Date($vizDateTo);
  const validFilters = $vizFilters.filter((d) => d[1].length);
  return $data.filter((row) => {
    const area = $vizFilterArea[1].length
      ? $vizFilterArea[1].includes(row[$vizFilterArea[0]])
      : true;
    const category = $vizDataType === 'CATEGORICAL' ? $vizChoice.includes(row[$vizField]) : true;
    const filter = validFilters.length
      ? !validFilters
          .map(([key, values]) => !values.length || values.includes(row[key.split('|')[1]]))
          .includes(false)
      : true;
    const dateFrom = $vizDateFrom ? row[$vizDateField] >= vizDateFromValue : true;
    const dateTo = $vizDateTo ? row[$vizDateField] <= vizDateToValue : true;
    return area && category && filter && dateFrom && dateTo;
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
  const $vizMethod = get(vizMethod);
  const $vizNumerical = get(vizNumerical);
  if ($vizDataType === 'CATEGORICAL') {
    const aggFunc = (v) => v.length;
    return rollup(filteredData, aggFunc, aggGroup);
  } else {
    const aggData = filteredData.flatMap((d) =>
      $vizNumerical.map((n) => ({ ...d, dataVizKey: n, dataVizValue: d[n] })),
    );
    const aggFunc = (v) => methods[$vizMethod](v, (d) => d.dataVizValue);
    return rollup(aggData, aggFunc, aggGroup);
  }
};

export const addDataLayer = () => {
  const $vizChoice = get(vizChoice);
  const $vizFilterArea = get(vizFilterArea);
  const $vizDisplayType = get(vizDisplayType);
  const $vizNumerical = get(vizNumerical);
  const $vizFilters = get(vizFilters);
  const filteredData = getDateFilteredData();
  if (
    (!$vizNumerical.length && !$vizChoice.length) ||
    (!filteredData.length && !$vizFilters.length)
  ) {
    removeDataLayer();
    return;
  }
  if ($vizDisplayType === 'MAP') {
    const $areaGeoJSON = get(areaGeoJSON);
    const $map = get(map);
    const aggGroups = aggregate(filteredData);
    const max = Math.max(...aggGroups.values(), 1e-99);
    vizMax.set(max);
    const features = $areaGeoJSON.features.map((feature) => ({
      ...feature,
      properties: { ...feature.properties, dataVizValue: aggGroups.get(feature.id) ?? 0 },
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
        ...($vizFilterArea[1].length && {
          filter: ['in', $vizFilterArea[0], ...$vizFilterArea[1]],
        }),
      },
      'areas-outline',
    );
    addHoverEvents();
  } else if ($vizDisplayType === 'CHART') {
    addChart(filteredData);
    vizVisable.set(true);
  }
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
