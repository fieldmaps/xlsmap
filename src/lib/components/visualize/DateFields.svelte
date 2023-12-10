<script lang="ts">
  import { addDataLayer } from '$lib/map/data';
  import { survey, vizDateField } from '$lib/stores';

  function isDateField({ type }: { type: string }) {
    return type === 'date';
  }
</script>

{#if $survey.filter(isDateField).length}
  <fieldset>
    <legend>Date</legend>
    <div class="date-group">
      <div class="select-group">
        <select
          bind:value={$vizDateField}
          class:placeholder={!$vizDateField}
          id="select-field"
          on:change={addDataLayer}
        >
          {#each $survey.filter(isDateField) as field}
            <option value={field.name}>{field.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </fieldset>
{/if}

<style>
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
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
