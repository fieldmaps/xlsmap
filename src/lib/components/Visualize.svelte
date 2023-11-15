<script lang="ts">
  import { downloadScreenshot } from '$lib/data/download';
  import { addDataLayer } from '$lib/map/data';
  import { survey, vizField, vizMethod } from '$lib/stores';
</script>

<section>
  <button on:click={downloadScreenshot}>↓ map.png</button>
  <hr />
  <form>
    <label for="select-field">Display Field</label>
    <div class="select-group">
      <select
        id="select-field"
        bind:value={$vizField}
        class:placeholder={!$vizField}
        on:change={addDataLayer}
      >
        <option hidden={$vizField !== null} disabled selected value={null}>select one</option>
        {#each $survey.filter((x) => x.type === 'integer') as field}
          <option value={field.name}>{field.label}</option>
        {/each}
      </select>
    </div>
    <br />
    <label for="select-field">Aggregation Method</label>
    <div class="select-group">
      <select
        id="select-field"
        bind:value={$vizMethod}
        class:placeholder={!$vizMethod}
        on:change={addDataLayer}
      >
        <option hidden={$vizMethod !== null} disabled selected value={null}>select one</option>
        <option value="SUM">Sum</option>
        <option value="MEAN">Mean</option>
        <option value="MIN">Min</option>
        <option value="MAX">Max</option>
      </select>
    </div>
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
  hr {
    width: 100%;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  select {
    border-radius: 0.25rem;
    border: 1px solid hsl(0, 0%, 56%);
    background-color: var(--background-color);
    color: var(--color);
    padding: 0 0.25rem;
    resize: vertical;
    flex: 1;
  }
  .placeholder {
    color: var(--color-2);
    font-weight: 200;
  }
  .select-group {
    display: flex;
  }
</style>
