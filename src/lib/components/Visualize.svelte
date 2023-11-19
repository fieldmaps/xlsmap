<script lang="ts">
  import { downloadScreenshot } from '$lib/data/download';
  import { addDataLayer } from '$lib/map/data';
  import {
    choices,
    survey,
    vizChoice,
    vizDateField,
    vizDateFrom,
    vizDateTo,
    vizField,
    vizHoverValue,
    vizMethod,
    vizType,
    vizVisable,
  } from '$lib/stores';
  import { format } from 'd3-format';

  const isVizField = ({ type }: { type: string }) =>
    ['integer', 'select_one'].includes(type.split(' ')[0]);

  const isVizDateField = ({ type }: { type: string }) => type === 'date';

  const resetDate = () => {
    $vizDateField = null;
    $vizDateFrom = null;
    $vizDateTo = null;
    addDataLayer();
  };

  const onChangeField = (e: Event) => {
    const [type, name] = e.target.value.split('|');
    $vizType = type;
    $vizField = name;
    $vizChoice = null;
    $vizMethod = null;
    addDataLayer();
  };
</script>

<section>
  <button on:click={downloadScreenshot} class:info={$vizVisable} disabled={!$vizVisable}>
    ↓ map.png
  </button>
  <hr />
  <form>
    <fieldset>
      <legend>Display</legend>
      <div class="date-group">
        <label for="select-field">Field</label>
        <div class="select-group">
          <select
            class:placeholder={!$vizField}
            id="select-field"
            on:change={onChangeField}
            value="{$vizType}|{$vizField}"
          >
            <option hidden={$vizField !== ''} disabled selected value="|">select one</option>
            {#each $survey.filter(isVizField) as field}
              <option value="{field.type}|{field.name}">{field.label}</option>
            {/each}
          </select>
        </div>
      </div>
      {#if $vizType.split(' ')[0] === 'select_one'}
        <div class="date-group">
          <label for="select-field">Category</label>
          <div class="select-group">
            <select
              bind:value={$vizChoice}
              class:placeholder={!$vizChoice}
              id="select-field"
              on:change={addDataLayer}
            >
              <option hidden={$vizChoice} disabled selected value={null}>select one</option>
              {#each $choices.filter(({ list_name }) => list_name === $vizType.split(' ')[1]) as choice}
                <option value={choice.name}>{choice.label}</option>
              {/each}
            </select>
          </div>
        </div>
      {/if}
      {#if $vizType === 'integer'}
        <div class="date-group">
          <label for="select-field">Aggregation</label>
          <div class="select-group">
            <select
              bind:value={$vizMethod}
              class:placeholder={!$vizMethod}
              id="select-field"
              on:change={addDataLayer}
            >
              <option hidden={$vizMethod} disabled selected value={null}>select one</option>
              <option value="Sum">Sum</option>
              <option value="Mean">Mean</option>
              <option value="Min">Min</option>
              <option value="Max">Max</option>
            </select>
          </div>
        </div>
      {/if}
    </fieldset>
    {#if $survey.filter(isVizDateField).length}
      <fieldset>
        <legend>Filter</legend>
        <div class="date-group">
          <label for="select-field">Date</label>
          <div class="select-group">
            <select
              bind:value={$vizDateField}
              class:placeholder={!$vizDateField}
              id="select-field"
              on:change={addDataLayer}
            >
              <option hidden={$vizDateField} disabled selected value={null}> select one </option>
              {#each $survey.filter(isVizDateField) as field}
                <option value={field.name}>{field.label}</option>
              {/each}
            </select>
            {#if $vizDateField}
              <button type="button" class="reset" on:click={resetDate}>✕</button>
            {/if}
          </div>
        </div>
        {#if $vizDateField}
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
        {/if}
      </fieldset>
    {/if}
    {#if $vizVisable}
      <fieldset>
        <legend>Hover</legend>
        {$vizMethod ?? 'Count'}: {$vizHoverValue % 1
          ? format('.1f')($vizHoverValue)
          : $vizHoverValue ?? ''}
      </fieldset>
    {/if}
  </form>
</section>

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
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
  }
  hr {
    width: 100%;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
  .info {
    background-color: cornflowerblue;
    color: white;
  }
  .date-group {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
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
  .select-group {
    display: flex;
  }
</style>
