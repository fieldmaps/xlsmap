<script lang="ts">
  import { PUBLIC_NAME } from '$env/static/public';
  import Filter from '$lib/components/Filter.svelte';
  import Manage from '$lib/components/Manage.svelte';
  import Playground from '$lib/components/Playground.svelte';
  import { fetchForm } from '$lib/data/fetch';
  import { formValid } from '$lib/stores';
  import { onMount } from 'svelte';

  const MANAGE = 'MANAGE';
  const FILTER = 'FILTER';

  export let root: boolean;
  let tab = MANAGE;
  if (!root) onMount(fetchForm);
</script>

<nav>
  <h1>{PUBLIC_NAME}</h1>
  <div class="tabs">
    <button
      class="left"
      class:active={tab === MANAGE}
      on:click={() => (tab = MANAGE)}
      disabled={!$formValid}
    >
      ☰ Manage
    </button>
    <button
      class="right"
      class:active={tab === FILTER}
      on:click={() => (tab = FILTER)}
      disabled={!$formValid}
    >
      ▼ Filter
    </button>
  </div>
  {#if tab === MANAGE}
    {#if root}
      <Playground />
    {/if}
    <Manage />
  {:else if tab === FILTER}
    <Filter />
  {/if}
</nav>

<style>
  @media only screen and (max-width: 768px) {
    h1 {
      display: none;
    }
    nav {
      height: 67%;
    }
  }
  @media only screen and (min-width: 769px) {
    nav {
      width: 25rem;
    }
  }
  button {
    background-color: var(--background-color-1);
    border: none;
    color: var(--color);
    cursor: pointer;
    flex-grow: 1;
    padding: 0.5rem 0;
  }
  button:disabled {
    cursor: initial;
  }
  button:focus,
  button:hover:not([disabled]) {
    filter: brightness(110%);
  }
  h1 {
    margin: 1rem 0 0 0;
  }
  nav {
    background-color: var(--background-color);
    color: var(--color);
    display: flex;
    flex-direction: column;
    padding: 0 1rem 1rem 1rem;
  }
  .active {
    background-color: var(--background-color-2);
  }
  .left {
    border-radius: 0.5rem 0 0 0.5rem;
  }
  .right {
    border-radius: 0 0.5rem 0.5rem 0;
  }
  .tabs {
    display: flex;
    margin: 1rem 0;
  }
</style>
