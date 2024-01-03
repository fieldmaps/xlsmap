<script lang="ts">
  import { PUBLIC_MAP } from '$env/static/public';
  import { CHART, MAP } from '$lib/consts';
  import { fetchAreas } from '$lib/data/fetch';
  import {
    map,
    vizChoice,
    vizChoiceLabel,
    vizDateFrom,
    vizDateTo,
    vizDisplayType,
    vizFieldLabel,
    vizMax,
    vizMethod,
    vizNumericalLabel,
    vizVisable,
  } from '$lib/stores';
  import { format } from 'd3-format';
  import type { LngLatBoundsLike } from 'maplibre-gl';
  import MapLibreGL from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { isMapboxURL, transformMapboxUrl } from 'maplibregl-mapbox-request-transformer';
  import { onMount } from 'svelte';

  const { Map, NavigationControl, ScaleControl } = MapLibreGL;

  export let root: boolean;
  let container: HTMLDivElement;
  const bounds: LngLatBoundsLike = [
    [-180, -90],
    [180, 90],
  ];

  function transformRequest(url: string, resourceType: string) {
    const apiKey = new URL(PUBLIC_MAP).searchParams.get('key');
    if (isMapboxURL(url)) return transformMapboxUrl(url, resourceType, apiKey);
    return { url };
  }

  onMount(() => {
    $map = new Map({
      attributionControl: false,
      container,
      bounds,
      preserveDrawingBuffer: true,
      style: PUBLIC_MAP,
      transformRequest,
    });
    $map.addControl(new ScaleControl({}), 'bottom-right');
    $map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
    if (!root) $map.once('styledata', fetchAreas);
  });
</script>

<div class="container">
  <div class="map" bind:this={container} class:hidden={$vizDisplayType !== MAP} />
  {#if $vizVisable}
    <div class="legend" class:hidden={$vizDisplayType !== MAP}>
      <div id="map-legend">
        <fieldset>
          <legend>Legend</legend>
          <div>
            <div>{$vizChoice.length ? $vizFieldLabel : $vizMethod}:</div>
            {#each $vizChoice.length ? $vizChoiceLabel : $vizNumericalLabel as option}
              <div>{option}</div>
            {/each}
          </div>
          <div>
            {#if $vizDateFrom}
              <div>From: {new Date($vizDateFrom).toLocaleDateString()}</div>
            {/if}
            {#if $vizDateTo}
              <div>To: {new Date($vizDateTo).toLocaleDateString()}</div>
            {/if}
          </div>
          <div class="flex">
            <div class="legend-color"></div>
            <div class="legend-column">
              <div>0</div>
              <div>{$vizMax % 1 ? format('.1f')($vizMax) : $vizMax}</div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  {/if}
  <div class="map" class:hidden={$vizDisplayType !== CHART}>
    {#if $vizVisable}
      <div id="viz" />
    {/if}
  </div>
</div>

<style>
  .map,
  .container {
    flex-grow: 1;
    height: 100%;
    overflow: auto;
  }
  #viz {
    height: 99%;
    width: 100%;
  }
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .flex {
    display: flex;
    gap: 0.5rem;
  }
  .container {
    position: relative;
  }
  .legend {
    background-color: white;
    bottom: 0.5rem;
    box-shadow: 0 0 0.3rem white;
    left: 0.5rem;
    position: absolute;
  }
  .legend-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .legend-column > div {
    height: 1rem;
  }
  .legend-color {
    background: linear-gradient(to bottom, #fcfbfd 0%, #3f007d 100%);
    height: 5rem;
    width: 1rem;
  }
  .hidden {
    display: none;
  }
</style>
