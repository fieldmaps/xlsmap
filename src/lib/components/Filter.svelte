<script lang="ts">
  import { exportScreenshot } from '$lib/fetch';
</script>

<section>
  <button on:click={exportScreenshot}>↓ map.png</button>
  <div>Filters</div>
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
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
