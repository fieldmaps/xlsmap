<script lang="ts">
  import { CHART, GROUPED, STACKED } from '$lib/consts';
  import { addDataLayer } from '$lib/map/data';
  import { vizChartType, vizDateGroup, vizDisplayType, vizVisable } from '$lib/stores';
</script>

{#if $vizVisable && $vizDisplayType === CHART}
  <fieldset>
    <legend>Chart Type</legend>
    <div class="radio-group">
      <label>
        <input bind:group={$vizChartType} type="radio" value={STACKED} on:change={addDataLayer} />
        Stacked
      </label>
      <label>
        <input bind:group={$vizChartType} type="radio" value={GROUPED} on:change={addDataLayer} />
        Grouped
      </label>
    </div>
  </fieldset>
  <fieldset>
    <legend>Date Grouping</legend>
    <div class="radio-group">
      <label>
        <input bind:group={$vizDateGroup} type="radio" value="yearweek" on:change={addDataLayer} />
        Weekly
      </label>
      <label>
        <input bind:group={$vizDateGroup} type="radio" value="yearmonth" on:change={addDataLayer} />
        Monthly
      </label>
      <label>
        <input
          bind:group={$vizDateGroup}
          type="radio"
          value="yearquarter"
          on:change={addDataLayer}
        />
        Quarterly
      </label>
    </div>
  </fieldset>
{/if}

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
