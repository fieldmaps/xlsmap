import { activeIndex, areaActive, areaProperties, data, map } from '$lib/stores';
import type { PointLike } from 'maplibre-gl';
import { get } from 'svelte/store';

const onMouseEnter = () => {
  if (get(areaActive)) {
    const $map = get(map);
    $map.getCanvas().style.cursor = 'pointer';
  }
};

const onMouseLeave = () => {
  if (get(areaActive)) {
    const $map = get(map);
    $map.getCanvas().style.cursor = 'inherit';
  }
};

const onClickArea = ({ point }: { point: PointLike }) => {
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
};

export const addEvents = () => {
  const $map = get(map);
  $map.off('mouseenter', 'areas', onMouseEnter);
  $map.on('mouseenter', 'areas', onMouseEnter);
  $map.off('mouseleave', 'areas', onMouseLeave);
  $map.on('mouseleave', 'areas', onMouseLeave);
  $map.off('click', 'areas', onClickArea);
  $map.on('click', 'areas', onClickArea);
};
