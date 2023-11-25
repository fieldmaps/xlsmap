<script lang="ts">
  import Chart from '$lib/components/Chart.svelte';
  import { downloadScreenshot } from '$lib/data/download';
  import { addDataLayer } from '$lib/map/data';
  import {
    areaProperties,
    choices,
    survey,
    vizChoice,
    vizChoiceLabel,
    vizDataType,
    vizDateField,
    vizDateFrom,
    vizDateTo,
    vizField,
    vizFieldLabel,
    vizHover,
    vizMethod,
    vizNumerical,
    vizNumericalLabel,
    vizType,
    vizVisable,
  } from '$lib/stores';
  import { format } from 'd3-format';

  const CATEGORICAL = 'CATEGORICAL';
  const NUMERICAL = 'NUMERICAL';

  const isCategorical = ({ type }: { type: string }) => type.split(' ')[0] === 'select_one';
  const isNumerical = ({ type }: { type: string }) => type === 'integer';

  const isVizDateField = ({ type }: { type: string }) => type === 'date';

  const resetDate = () => {
    $vizDateField = null;
    $vizDateFrom = null;
    $vizDateTo = null;
    addDataLayer();
  };

  const onChangeDataType = () => {
    $vizField = '';
    $vizType = '';
    $vizFieldLabel = '';
    $vizChoice = [];
    $vizChoiceLabel = [];
    $vizNumerical = [];
    $vizNumericalLabel = [];
    $vizMethod = null;
    addDataLayer();
  };

  const onChangeCategorical = (e: Event) => {
    const [type, name] = e.target.value.split('|');
    $vizField = name;
    $vizFieldLabel = e.target.selectedOptions[0].label;
    $vizType = type;
    $vizChoice = [];
    addDataLayer();
  };

  const onChangeNumerical = (e: Event) => {
    const label = e.target.labels[0].textContent;
    $vizNumericalLabel = e.target.checked
      ? [...$vizNumericalLabel, label]
      : $vizNumericalLabel.filter((x) => x !== label);
    addDataLayer();
  };

  const onChangeChoice = (e: Event) => {
    const label = e.target.labels[0].textContent;
    $vizChoiceLabel = e.target.checked
      ? [...$vizChoiceLabel, label]
      : $vizChoiceLabel.filter((x) => x !== label);
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
      <legend>Data Type</legend>
      <div class="radio-group">
        <label>
          <input
            bind:group={$vizDataType}
            type="radio"
            value={CATEGORICAL}
            on:change={onChangeDataType}
          />
          Categorical
        </label>
        <label>
          <input
            bind:group={$vizDataType}
            type="radio"
            value={NUMERICAL}
            on:change={onChangeDataType}
          />
          Numerical
        </label>
      </div>
    </fieldset>
    {#if $vizDataType}
      <fieldset>
        <legend>Display</legend>
        <div class="date-group">
          {#if $vizDataType === CATEGORICAL}
            <label for="select-field">Field</label>
            <div class="select-group">
              <select
                class:placeholder={!$vizField}
                id="select-field"
                on:change={onChangeCategorical}
                value="{$vizType}|{$vizField}"
              >
                <option hidden={$vizField !== ''} disabled selected value="|">select one</option>
                {#each $survey.filter(isCategorical) as field}
                  <option value="{field.type}|{field.name}">{field.label}</option>
                {/each}
              </select>
            </div>
            {#if $vizField}
              <div class="date-group">
                <div>Category</div>
                {#each $choices.filter(({ list_name }) => list_name === $vizType.split(' ')[1]) as choice}
                  <label>
                    <input
                      bind:group={$vizChoice}
                      on:change={onChangeChoice}
                      type="checkbox"
                      value={choice.name}
                    />
                    {choice.label}
                  </label>
                {/each}
              </div>
            {/if}
          {/if}
          {#if $vizDataType === NUMERICAL}
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
            {#if $vizMethod}
              <div class="date-group">
                <div>Fields</div>
                {#each $survey.filter(isNumerical) as field}
                  <label>
                    <input
                      bind:group={$vizNumerical}
                      on:change={onChangeNumerical}
                      type="checkbox"
                      value={field.name}
                    />
                    {field.label}
                  </label>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
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
          <div class="row-group">
            <div>Area:</div>
            <div>{$vizHover[$areaProperties[0]] ?? ''}</div>
          </div>
          <div class="row-group">
            <div>{$vizMethod ?? 'Count'}:</div>
            <div>
              {$vizHover.dataVizValue % 1
                ? format('.1f')($vizHover.dataVizValue)
                : $vizHover.dataVizValue ?? ''}
            </div>
          </div>
        </fieldset>
      {/if}
    {/if}
  </form>
  {#if $vizVisable}
    <Chart />
  {/if}
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
  .row-group {
    display: flex;
    justify-content: space-between;
  }
  .radio-group {
    display: flex;
    justify-content: space-around;
  }
  .select-group {
    display: flex;
  }
</style>
