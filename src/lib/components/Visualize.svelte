<script lang="ts">
  import ChartControls from '$lib/components/visualize/ChartControls.svelte';
  import DataFields from '$lib/components/visualize/DataFields.svelte';
  import DateFields from '$lib/components/visualize/DateFields.svelte';
  import DisplayType from '$lib/components/visualize/DisplayType.svelte';
  import Filters from '$lib/components/visualize/Filters.svelte';
  import MapInfo from '$lib/components/visualize/MapInfo.svelte';
  import { CHART, MAP } from '$lib/consts';
  import { downloadChart, downloadMap } from '$lib/data/download';
  import { vizDataType, vizDisplayType, vizVisable } from '$lib/stores';
</script>

<section>
  {#if $vizDisplayType === MAP}
    <button on:click={downloadMap} class:info={$vizVisable} disabled={!$vizVisable}>
      ↓ map.png
    </button>
  {/if}
  {#if $vizDisplayType === CHART}
    <button on:click={downloadChart} class:info={$vizVisable} disabled={!$vizVisable}>
      ↓ chart.png
    </button>
  {/if}
  <hr />
  <form>
    <DisplayType />
    {#if $vizDataType}
      <DataFields />
      <DateFields />
      <MapInfo />
      <ChartControls />
    {/if}
    {#if $vizVisable}
      <Filters />
    {/if}
  </form>
</section>

<style>
  button {
    background-color: var(--background-color-1);
    border-radius: 0.5rem;
    border: none;
    color: var(--color);
    cursor: pointer;
    flex-grow: 1;
    padding: 0.5rem;
    text-align: center;
  }
  button:focus,
  button:hover:not([disabled]) {
    filter: brightness(110%);
  }
  button:disabled {
    cursor: default;
  }
  form {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  hr {
    width: 100%;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: hidden;
  }
  .info {
    background-color: cornflowerblue;
    color: white;
  }
</style>
