<script lang="ts">
  import 'normalize.css';
</script>

<slot />

<style>
  :global(html, body) {
    height: 100%;

    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';

    --background-color: hsl(0, 0%, 12%);
    --background-color-1: hsl(0, 0%, 18%);
    --background-color-2: hsl(0, 0%, 30%);
    --color: hsl(0, 0%, 100%);
    --color-1: hsl(0, 0%, 90%);
    --color-2: hsl(0, 0%, 80%);

    @media (prefers-color-scheme: light) {
      --background-color: hsl(0, 0%, 100%);
      --background-color-1: hsl(0, 0%, 90%);
      --background-color-2: hsl(0, 0%, 80%);
      --color: hsl(0, 0%, 0%);
      --color-1: hsl(0, 0%, 10%);
      --color-2: hsl(0, 0%, 20%);
    }
  }
</style>
