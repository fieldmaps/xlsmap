import { activeIndex, areaActive, areaProperties, data, map, vizHover } from '$lib/stores';
import type { PointLike } from 'maplibre-gl';
import { get } from 'svelte/store';

function onMouseEnter() {
  if (get(areaActive)) {
    const $map = get(map);
    $map.getCanvas().style.cursor = 'pointer';
  }
}

function onMouseLeave() {
  if (get(areaActive)) {
    const $map = get(map);
    $map.getCanvas().style.cursor = 'inherit';
  }
}

function onClickArea({ point }: { point: PointLike }) {
  if (get(areaActive)) {
    const $map = get(map);
    const $data = get(data);
    const $areaProperties = get(areaProperties);
    const $activeIndex = get(activeIndex);
    const features = $map.queryRenderedFeatures(point, { layers: ['areas'] });
    if (features.length) {
      const { properties } = features[0];
      for (const key of $areaProperties) $data[$activeIndex][key] = properties[key] ?? null;
      data.set($data);
      areaActive.set(false);
      $map.getCanvas().style.cursor = 'inherit';
    }
  }
}

function onFillHover({ point }: { point: PointLike }) {
  const $map = get(map);
  const features = $map.queryRenderedFeatures(point, { layers: ['areas-fill'] });
  if (features.length) {
    const { properties } = features[0];
    $map.getCanvas().style.cursor = 'pointer';
    vizHover.set(properties);
  } else {
    $map.getCanvas().style.cursor = 'inherit';
    vizHover.set({});
  }
}

export function removeEvents() {
  const $map = get(map);
  $map.off('mouseenter', 'areas', onMouseEnter);
  $map.off('mouseleave', 'areas', onMouseLeave);
  $map.off('click', 'areas', onClickArea);
}

export function addEvents() {
  removeEvents();
  const $map = get(map);
  $map.on('mouseenter', 'areas', onMouseEnter);
  $map.on('mouseleave', 'areas', onMouseLeave);
  $map.on('click', 'areas', onClickArea);
}

export function addHoverEvents() {
  removeHoverEvents();
  const $map = get(map);
  $map.on('mousemove', 'areas-fill', onFillHover);
  $map.on('mouseleave', 'areas-fill', onFillHover);
}

export function removeHoverEvents() {
  const $map = get(map);
  $map.off('mousemove', 'areas-fill', onFillHover);
  $map.off('mouseleave', 'areas-fill', onFillHover);
}
