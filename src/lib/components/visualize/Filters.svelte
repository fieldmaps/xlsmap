<script lang="ts">
  import { addDataLayer } from '$lib/map/data';
  import {
    areaGeoJSON,
    areaProperties,
    choices,
    survey,
    vizDateField,
    vizDateFrom,
    vizDateTo,
    vizFilterArea,
    vizFilters,
  } from '$lib/stores';

  function addFilter() {
    $vizFilters = [...$vizFilters, ['', []]];
  }

  function removeFilter(index: number) {
    $vizFilters.splice(index, 1);
    $vizFilters = $vizFilters;
    addDataLayer();
  }

  function removeAreaFilter() {
    $vizFilterArea = ['', []];
    addDataLayer();
  }

  function onChangeFilterAreaField(e) {
    $vizFilterArea = [e.target.value, []];
    addDataLayer();
  }

  function onChangeFilterField(e, index) {
    $vizFilters[index] = [e.target.value, []];
    addDataLayer();
  }
</script>

<button on:click={addFilter} class="info">+ filter</button>
<hr />
<fieldset>
  <legend>Filter Area</legend>
  <div class="select-group">
    <select
      class:placeholder={!$vizFilterArea[0]}
      id="select-area"
      on:change={onChangeFilterAreaField}
      value={$vizFilterArea[0]}
    >
      <option hidden={$vizFilterArea[0]} disabled selected value="">select one</option>
      {#each $areaProperties as areaProperty}
        <option value={areaProperty}>{areaProperty}</option>
      {/each}
    </select>
    {#if $vizFilterArea[0]}
      <button type="button" class="reset" on:click={removeAreaFilter}>✕</button>
    {/if}
  </div>
  {#if $vizFilterArea[0]}
    <div class="date-group">
      {#each new Set($areaGeoJSON.features.map((feature) => feature.properties[$vizFilterArea[0]])) as value}
        <label>
          <input bind:group={$vizFilterArea[1]} on:change={addDataLayer} type="checkbox" {value} />
          {value}
        </label>
      {/each}
    </div>
  {/if}
</fieldset>
{#if $vizDateField}
  <fieldset>
    <legend>Filter Date</legend>
    <div class="date-group">
      <label for="date-filter">From</label>
      <input
        bind:value={$vizDateFrom}
        class:placeholder={!$vizDateFrom}
        class="select-group"
        max={$vizDateTo}
        on:change={addDataLayer}
        type="date"
      />
    </div>
    <div class="date-group">
      <label for="date-filter">To</label>
      <input
        on:change={addDataLayer}
        bind:value={$vizDateTo}
        class:placeholder={!$vizDateTo}
        class="select-group"
        min={$vizDateFrom}
        type="date"
      />
    </div>
  </fieldset>
{/if}
{#each $vizFilters as filter, index}
  <fieldset>
    <legend>Filter {index + 1}</legend>
    <div class="select-group">
      <select
        class:placeholder={!filter[0]}
        id="select-filter"
        on:change={(e) => onChangeFilterField(e, index)}
        value={filter[0]}
      >
        <option hidden={filter[0]} disabled selected value="">select one</option>
        {#each $survey.filter(({ type, name }) => {
          const isSelectOne = type.split(' ')[0] === 'select_one';
          const filterExists = $vizFilters.map((row) => row[0].split('|')[1]).includes(name);
          const isCurrent = $vizFilters[index][0] === `${type}|${name}`;
          return isSelectOne && (!filterExists || isCurrent);
        }) as field}
          <option value="{field.type}|{field.name}">{field.label}</option>
        {/each}
      </select>
      {#if filter[0]}
        <button type="button" class="reset" on:click={() => removeFilter(index)}>✕</button>
      {/if}
    </div>
    {#if filter[0]}
      <div class="date-group">
        {#each $choices.filter(({ list_name }) => list_name === filter[0]
              .split('|')[0]
              .split(' ')[1]) as choice}
          <label>
            <input
              bind:group={filter[1]}
              on:change={addDataLayer}
              type="checkbox"
              value={choice.name}
            />
            {choice.label}
          </label>
        {/each}
      </div>
    {/if}
  </fieldset>
{/each}

<style>
  @media (prefers-color-scheme: dark) {
    input[type='date']::-webkit-inner-spin-button,
    input[type='date']::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }
  }
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
  input,
  select {
    border-radius: 0.25rem;
    border: 1px solid hsl(0, 0%, 56%);
    background-color: var(--background-color);
    color: var(--color);
    padding: 0 0.25rem;
    resize: vertical;
    flex: 1;
  }
  hr {
    width: 99%;
  }
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
  }
  .date-group {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
  }
  .select-group {
    display: flex;
  }
  .info {
    background-color: cornflowerblue;
    color: white;
  }
  .placeholder {
    color: var(--color-2);
    font-weight: 200;
  }
  .reset {
    background-color: var(--background-color);
    flex-grow: 0;
    margin: 0 0 0 0.5rem;
    padding: 0;
    width: fit-content;
  }
</style>
