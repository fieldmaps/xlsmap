<script lang="ts">
  import { page } from '$app/stores';
  import Map from '$lib/components/Map.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
  <link rel="manifest" href={`/${$page.params.slug}/`} />
</svelte:head>

<main>
  <Sidebar root={false} />
  <Map root={false} />
</main>

<style>
  @media only screen and (max-width: 768px) {
    main {
      flex-direction: column-reverse;
    }
  }
  main {
    height: 100%;
    display: flex;
  }
</style>
