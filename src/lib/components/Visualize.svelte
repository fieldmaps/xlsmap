<script lang="ts">
  import { downloadScreenshot } from '$lib/data/download';
  import { addDataLayer } from '$lib/map/data';
  import { choices, survey, vizChoice, vizField, vizMethod, vizType } from '$lib/stores';

  const isVizField = ({ type }: { type: string }) =>
    ['integer', 'select_one'].includes(type.split(' ')[0]);

  const onChangeField = (e: Event) => {
    const [type, name] = e.target.value.split('|');
    $vizType = type;
    $vizField = name;
    $vizChoice = null;
    addDataLayer();
  };
</script>

<section>
  <button on:click={downloadScreenshot}>↓ map.png</button>
  <hr />
  <form>
    <label for="select-field">Display Field</label>
    <div class="select-group">
      <select
        id="select-field"
        value={`${$vizType}|${$vizField}`}
        class:placeholder={!$vizField}
        on:change={onChangeField}
      >
        <option hidden={$vizField !== ''} disabled selected value="|">select one</option>
        {#each $survey.filter(isVizField) as field}
          <option value={`${field.type}|${field.name}`}>{field.label}</option>
        {/each}
      </select>
    </div>
    <br />
    {#if $vizType.split(' ')[0] === 'select_one'}
      <label for="select-field">Category</label>
      <div class="select-group">
        <select
          id="select-field"
          bind:value={$vizChoice}
          class:placeholder={!$vizChoice}
          on:change={addDataLayer}
        >
          <option hidden={$vizChoice !== null} disabled selected value={null}>select one</option>
          {#each $choices.filter(({ list_name }) => list_name === $vizType.split(' ')[1]) as choice}
            <option value={choice.name}>{choice.label}</option>
          {/each}
        </select>
      </div>
    {/if}
    {#if $vizType === 'integer'}
      <label for="select-field">Aggregation</label>
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
