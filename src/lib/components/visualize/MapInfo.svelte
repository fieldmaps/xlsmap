<script lang="ts">
  import { MAP } from '$lib/consts';
  import { areaProperties, vizDisplayType, vizHover, vizMethod, vizVisable } from '$lib/stores';
  import { format } from 'd3-format';
</script>

{#if $vizVisable && $vizDisplayType === MAP}
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

<style>
  fieldset {
    border-color: var(--background-color-2);
    margin: 0.5rem 0;
  }
  .row-group {
    display: flex;
    justify-content: space-between;
  }
</style>
