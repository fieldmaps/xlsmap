<script lang="ts">
  import Form from '$lib/components/Form.svelte';
  import { exportData, importData } from '$lib/fetch';
  import { getEmptyRow } from '$lib/form';
  import { activeIndex, data, formValid } from '$lib/stores';

  const addLocation = () => {
    $data = [...$data, getEmptyRow()];
    $activeIndex = $data.length - 1;
    $formValid = false;
    setTimeout(() => {
      const element = document.getElementById(`location-${$activeIndex}`);
      if (element) element.scrollIntoView(true);
    });
  };

  const openDrawer = (index: number) => {
    $formValid = false;
    $activeIndex = index;
  };
</script>

<nav>
  <div class="tabs">
    <label class="button" for="upload">↑ xlsx</label>
    <input on:change={importData} type="file" name="upload" id="upload" accept=".xlsx" />
    <button disabled={!$formValid || !$data.length} class="button" on:click={exportData}>
      ↓ xlsx
    </button>
  </div>
  <button disabled={!$formValid} class="info" on:click={addLocation}> + location </button>
  <hr />
  <div class="overflow">
    {#each $data as row, index}
      <section id="location-{index}">
        <button
          disabled={!$formValid}
          class="drawer"
          class:active={$activeIndex === index}
          on:click={() => openDrawer(index)}
        >
          {index + 1}
        </button>
        <Form {row} {index} />
      </section>
    {/each}
  </div>
</nav>

<style>
  button,
  .button {
    background-color: var(--background-color-1);
    border-radius: 0.5rem;
    border: none;
    color: var(--color);
    cursor: pointer;
    padding: 0.5rem;
    text-align: center;
  }
  button:disabled {
    cursor: default;
  }
  button:focus,
  button:hover:not([disabled]),
  .button:focus,
  .button:hover:not([disabled]) {
    filter: brightness(110%);
  }
  hr {
    width: 100%;
  }
  input[type='file'] {
    display: none;
  }
  nav {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    gap: 1rem;
    overflow: hidden;
  }
  .active {
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: var(--background-color-2);
  }
  .button {
    flex: 1 1 auto;
  }
  .drawer {
    width: 100%;
  }
  .info {
    background-color: cornflowerblue;
    color: white;
  }
  .overflow {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    gap: 0.5rem;
    overflow: auto;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
</style>
