<script lang="ts">
  import { PUBLIC_API } from '$env/static/public';
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
  import { Map, NavigationControl, ScaleControl, type LngLatBoundsLike } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { onMount } from 'svelte';

  export let root: boolean;
  let container: HTMLDivElement;
  const bounds: LngLatBoundsLike = [
    [-180, -90],
    [180, 90],
  ];

  onMount(() => {
    $map = new Map({
      attributionControl: false,
      container,
      bounds,
      preserveDrawingBuffer: true,
      style: `https://api.maptiler.com/maps/dataviz/style.json?key=${PUBLIC_API}`,
    });
    $map.addControl(new ScaleControl({}), 'bottom-right');
    $map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
    if (!root) $map.once('styledata', fetchAreas);
  });
</script>

<div class="container">
  <div class="map" bind:this={container} class:hidden={$vizDisplayType !== 'MAP'} />
  {#if $vizVisable}
    <div class="legend" class:hidden={$vizDisplayType !== 'MAP'}>
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
  <div class="map" class:hidden={$vizDisplayType !== 'CHART'}>
    <div id="viz" />
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
    bottom: 0.5rem;
    left: 0.5rem;
    position: absolute;
    text-shadow: 0 0 0.3rem white;
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
