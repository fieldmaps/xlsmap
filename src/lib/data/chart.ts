import { CATEGORICAL, GROUPED } from '$lib/consts';
import {
  choices,
  survey,
  vizChartType,
  vizChoice,
  vizDataType,
  vizDateField,
  vizDateGroup,
  vizField,
  vizFieldLabel,
  vizMethod,
  vizNumerical,
  vizType,
} from '$lib/stores';
import { get } from 'svelte/store';
import vegaEmbed from 'vega-embed';
import type { TopLevelSpec } from 'vega-lite';

const timeFormat = {
  yearweek: '%d %b, %Y',
  yearmonth: '%b, %Y',
  yearquarter: '%b, %Y',
};

function getCategoricalSpec(data) {
  const $choices = get(choices);
  const $vizChartType = get(vizChartType);
  const $vizChoice = get(vizChoice);
  const $vizDateField = get(vizDateField);
  const $vizDateGroup = get(vizDateGroup);
  const $vizField = get(vizField);
  const $vizFieldLabel = get(vizFieldLabel);
  const $vizType = get(vizType);
  const choicesLabels = $choices
    .filter(({ list_name }) => list_name === $vizType.split(' ')[1])
    .reduce((acc, cur) => ({ ...acc, [cur.name]: cur.label }), {});
  const spec: TopLevelSpec = {
    width: 'container',
    height: 'container',
    autosize: { resize: true },
    data: { values: data },
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: {
        field: $vizDateField,
        type: 'temporal',
        timeUnit: $vizDateGroup,
        axis: { title: null, format: timeFormat[$vizDateGroup] },
      },
      y: {
        field: $vizField,
        aggregate: 'count',
        type: 'quantitative',
        axis: { title: null },
      },
      ...($vizChartType === GROUPED && { xOffset: { field: $vizField } }),
      color: {
        field: $vizField,
        scale: { scheme: $vizChoice.length > 10 ? 'tableau20' : 'tableau10' },
        legend: {
          title: $vizFieldLabel,
          labelExpr: `${JSON.stringify(choicesLabels)}[datum.label]`,
        },
      },
    },
  };
  return spec;
}

function getNumericalSpec(data) {
  const $survey = get(survey);
  const $vizChartType = get(vizChartType);
  const $vizDateField = get(vizDateField);
  const $vizDateGroup = get(vizDateGroup);
  const $vizMethod = get(vizMethod);
  const $vizNumerical = get(vizNumerical);
  const surveyLabels = $survey.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.label }), {});
  const spec: TopLevelSpec = {
    width: 'container',
    height: 'container',
    autosize: { resize: true },
    data: { values: data },
    transform: [{ fold: $vizNumerical }],
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: {
        field: $vizDateField,
        type: 'temporal',
        timeUnit: $vizDateGroup,
        axis: { title: null, format: timeFormat[$vizDateGroup] },
      },
      y: {
        field: 'value',
        aggregate: $vizMethod.toLowerCase(),
        type: 'quantitative',
        axis: { title: null },
      },
      ...($vizChartType === GROUPED && { xOffset: { field: 'key' } }),
      color: {
        field: 'key',
        scale: { scheme: $vizNumerical.length > 10 ? 'tableau20' : 'tableau10' },
        legend: {
          title: $vizMethod,
          labelExpr: `${JSON.stringify(surveyLabels)}[datum.label]`,
        },
      },
    },
  };
  return spec;
}

export function addChart(data) {
  const $vizDataType = get(vizDataType);
  const spec = $vizDataType === CATEGORICAL ? getCategoricalSpec(data) : getNumericalSpec(data);
  vegaEmbed('#viz', spec, { mode: 'vega-lite', actions: false });
  setTimeout(() => window.dispatchEvent(new Event('resize')));
}
