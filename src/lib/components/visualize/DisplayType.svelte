<script lang="ts">
  import { CATEGORICAL, CHART, MAP, NUMERICAL } from '$lib/consts';
  import { addDataLayer } from '$lib/map/data';
  import {
    vizChoice,
    vizChoiceLabel,
    vizDataType,
    vizDisplayType,
    vizField,
    vizFieldLabel,
    vizMethod,
    vizNumerical,
    vizNumericalLabel,
    vizType,
  } from '$lib/stores';

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
</script>

<fieldset>
  <legend>Display Type</legend>
  <div class="radio-group">
    <label>
      <input bind:group={$vizDisplayType} type="radio" value={MAP} on:change={addDataLayer} />
      Map
    </label>
    <label>
      <input bind:group={$vizDisplayType} type="radio" value={CHART} on:change={addDataLayer} />
      Chart
    </label>
  </div>
</fieldset>
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

<style>
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
  }
  input {
    border-radius: 0.25rem;
    border: 1px solid hsl(0, 0%, 56%);
    background-color: var(--background-color);
    color: var(--color);
    padding: 0 0.25rem;
    resize: vertical;
    flex: 1;
  }
  .radio-group {
    display: flex;
    justify-content: space-around;
  }
</style>
