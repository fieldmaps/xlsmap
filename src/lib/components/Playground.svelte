<script lang="ts">
  import { fileToBuffer, fileToJSON } from '$lib/data/convert';
  import { loadForm, loadGeoJSON } from '$lib/data/load';
  import { initMap } from '$lib/map/init';
  import { activeIndex, areaProperties, survey } from '$lib/stores';

  export const importGeoJSON = async (e: Event) => {
    const geojson = await fileToJSON(e.target.files[0]);
    loadGeoJSON(geojson);
    initMap();
  };

  export const importXLSForm = async (e: Event) => {
    const file = await fileToBuffer(e.target.files[0]);
    await loadForm(file);
  };
</script>

<div class="tabs">
  <label
    class:disabled={$activeIndex !== -1}
    class:info={!$areaProperties.length}
    class="button"
    for="upload-areas"
  >
    ↑ GeoJSON
  </label>
  <input
    accept=".geojson"
    disabled={$activeIndex !== -1}
    id="upload-areas"
    name="upload-areas"
    on:change={importGeoJSON}
    type="file"
  />
  <label
    class:disabled={$activeIndex !== -1}
    class:info={!$survey.length}
    class="button"
    for="upload-form"
  >
    ↑ XLSForm
  </label>
  <input
    accept=".xlsx"
    disabled={$activeIndex !== -1}
    id="upload-form"
    name="upload-form"
    on:change={importXLSForm}
    type="file"
  />
</div>

<style>
  input {
    display: none;
  }
  .button {
    background-color: var(--background-color-1);
    border-radius: 0.5rem;
    border: none;
    color: var(--color);
    cursor: pointer;
    flex: 1 1 auto;
    padding: 0.5rem;
    text-align: center;
  }
  .button:focus,
  .button:hover:not(.disabled) {
    filter: brightness(110%);
  }
  .disabled {
    cursor: initial;
  }
  .info {
    background-color: cornflowerblue;
    color: white;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
</style>
