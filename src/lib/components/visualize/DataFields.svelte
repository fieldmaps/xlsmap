<script lang="ts">
  import { CATEGORICAL, NUMERICAL } from '$lib/consts';
  import { addDataLayer } from '$lib/map/data';
  import {
    choices,
    survey,
    vizChoice,
    vizChoiceLabel,
    vizDataType,
    vizField,
    vizFieldLabel,
    vizMethod,
    vizNumerical,
    vizNumericalLabel,
    vizType,
  } from '$lib/stores';

  function isCategorical({ type }: { type: string }) {
    return type.split(' ')[0] === 'select_one';
  }

  function isNumerical({ type }: { type: string }) {
    return type === 'integer';
  }

  function onChangeCategorical(e: Event) {
    const [type, name] = e.target.value.split('|');
    $vizField = name;
    $vizFieldLabel = e.target.selectedOptions[0].label;
    $vizType = type;
    $vizChoice = [];
    $vizChoiceLabel = [];
    addDataLayer();
  }

  function onChangeNumerical(e: Event) {
    const label = e.target.labels[0].textContent;
    $vizNumericalLabel = e.target.checked
      ? [...$vizNumericalLabel, label]
      : $vizNumericalLabel.filter((x) => x !== label);
    addDataLayer();
  }

  function onChangeChoice(e: Event) {
    const label = e.target.labels[0].textContent;
    $vizChoiceLabel = e.target.checked
      ? [...$vizChoiceLabel, label]
      : $vizChoiceLabel.filter((x) => x !== label);
    addDataLayer();
  }
</script>

<fieldset>
  <legend>Data</legend>
  <div class="date-group">
    {#if $vizDataType === CATEGORICAL}
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

<style>
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
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
  .select-group {
    display: flex;
  }
</style>
