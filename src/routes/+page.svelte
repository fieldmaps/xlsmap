<script lang="ts">
  import Map from '$lib/components/Map.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
  <link rel="manifest" href="/" />
</svelte:head>

<main>
  <Sidebar root={true} />
  <Map root={true} />
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
