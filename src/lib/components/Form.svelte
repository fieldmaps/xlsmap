<script lang="ts">
  import { putData } from '$lib/data/fetch';
  import {
    activeIndex,
    areaActive,
    areaProperties,
    choices,
    data,
    dataOnCloud,
    formValid,
    survey,
  } from '$lib/stores';

  export let row;
  export let index: number;

  async function closeDrawer() {
    if ($dataOnCloud) await putData();
    $formValid = true;
    $activeIndex = -1;
  }

  function onInvalid() {
    $formValid = false;
  }

  async function deleteLocation() {
    $data.splice(index, 1);
    $data = $data;
    if ($dataOnCloud) await putData();
    $formValid = true;
    $activeIndex = -1;
  }
</script>

<form on:submit={closeDrawer} class="drawer">
  <div class="title-group">
    <div class="title">Properties</div>
    <div class="grow" />
    <input class="area-input" required value={row[$areaProperties[0]]} />
    <button
      type="button"
      class:info={!row[$areaProperties[0]] && !$areaActive}
      on:click={() => ($areaActive = !$areaActive)}
    >
      {$areaActive ? 'Cancel Update' : 'Click Map'}
    </button>
  </div>
  {#each $areaProperties as areaProperty}
    <div class="row-group">
      <div class="label">{areaProperty}</div>
      <div>{row[areaProperty] ?? ''}</div>
    </div>
  {/each}
  <hr />
  {#each $survey as survey}
    <div class="column-group">
      <label for="{index}-{survey.name}">
        <span>{survey.label}</span>
        <span class="optional">
          {survey.required?.toLowerCase() !== 'yes' ? '– optional' : ''}
        </span>
      </label>
      {#if survey.appearance === 'multiline'}
        <textarea
          bind:value={row[survey.name]}
          id="{index}-{survey.name}"
          on:invalid={onInvalid}
          required={survey.required?.toLowerCase() === 'yes'}
        />
      {:else if survey.type === 'text'}
        <input
          bind:value={row[survey.name]}
          id="{index}-{survey.name}"
          on:invalid={onInvalid}
          required={survey.required?.toLowerCase() === 'yes'}
        />
      {:else if survey.type === 'integer'}
        <input
          bind:value={row[survey.name]}
          class:placeholder={row[survey.name] === survey.default}
          id="{index}-{survey.name}"
          on:invalid={onInvalid}
          pattern="\d+"
          required={survey.required?.toLowerCase() === 'yes'}
          step="1"
          type="number"
        />
      {:else if survey.type === 'date'}
        <input
          class:placeholder={!row[survey.name]}
          id="{index}-{survey.name}"
          on:change={(e) => (row[survey.name] = e.target.valueAsDate)}
          on:invalid={onInvalid}
          required={survey.required?.toLowerCase() === 'yes'}
          type="date"
          value={row[survey.name]?.toISOString().split('T')[0]}
        />
      {:else if survey.type.startsWith('select_one')}
        <div class="select-group">
          <select
            bind:value={row[survey.name]}
            class:placeholder={!row[survey.name]}
            id="{index}-{survey.name}"
            on:invalid={onInvalid}
            required={survey.required?.toLowerCase() === 'yes'}
          >
            <option hidden={row[survey.name] !== null} disabled selected value={null}>
              select one
            </option>
            {#each $choices.filter((x) => x.list_name === survey.type.split(' ')[1]) as choice}
              <option value={choice.name}>{choice.label}</option>
            {/each}
          </select>
          {#if survey.required?.toLowerCase() !== 'yes' && row[survey.name] !== null}
            <button type="button" class="reset" on:click={() => (row[survey.name] = null)}>
              ✕
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
  <div class="button-group">
    <button type="submit" class="success">✓ Save</button>
    <button type="button" class="warning" on:click={deleteLocation}>✕ Delete</button>
  </div>
</form>

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
  }
  button.info {
    background-color: cornflowerblue;
    color: white;
  }
  button.info:focus {
    outline: none;
  }
  button.success {
    background-color: seagreen;
    color: white;
  }
  button.warning {
    background-color: crimson;
    color: white;
  }
  button:disabled {
    cursor: default;
  }
  button:focus {
    outline: 3px #007aff solid;
  }
  button:hover:not([disabled]) {
    filter: brightness(110%);
  }
  form {
    border: var(--background-color-2) 0.2rem solid;
  }
  hr {
    border: var(--background-color-2) 0.1rem solid;
  }
  input,
  textarea,
  select {
    border-radius: 0.25rem;
    border: 1px solid hsl(0, 0%, 56%);
    background-color: var(--background-color);
    color: var(--color);
    padding: 0 0.25rem;
    resize: vertical;
    flex: 1;
  }
  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  label,
  .label {
    font-weight: 500;
    flex: 1;
  }
  textarea {
    min-width: 90%;
  }
  .area-input {
    opacity: 0;
    padding: 0;
    width: 0;
  }
  .button-group {
    display: flex;
    gap: 1rem;
    margin: 1rem;
  }
  .column-group {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    margin: 0.5rem 1rem;
  }
  .drawer {
    border-radius: 0 0 0.5rem 0.5rem;
    overflow: auto;
    background-color: var(--background-color-1);
  }
  .grow {
    flex: 100;
  }
  .optional {
    color: var(--color-2);
    font-style: oblique;
    font-weight: 200;
  }
  .placeholder {
    color: var(--color-2);
    font-weight: 200;
  }
  .reset {
    flex-grow: 0;
    margin: 0 0 0 0.5rem;
    padding: 0;
    width: fit-content;
  }
  .row-group {
    display: flex;
    justify-content: space-between;
    margin: 0.25rem 1rem;
  }
  .select-group {
    display: flex;
  }
  .title {
    font-size: large;
    font-weight: bold;
  }
  .title-group {
    align-items: baseline;
    display: flex;
    justify-content: space-between;
    margin: 0.5rem;
  }
</style>
