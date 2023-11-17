import {
  areaGeoJSON,
  areaProperties,
  data,
  formValid,
  map,
  survey,
  vizChoice,
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
    const $areaProperties = get(areaProperties);
    const $data = get(data);
    const $map = get(map);
    const aggFunc = $vizChoice
      ? (v) => sum(v, (d) => (d[$vizField] === $vizChoice ? 1 : 0))
      : (v) => methods[$vizMethod](v, (d) => d[$vizField]);
    const dataAgg = rollup($data, aggFunc, (d) => $areaProperties.map((prop) => d[prop]).join('|'));
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
  $map.getLayer('areas-fill') && $map.removeLayer('areas-fill');
};
