<script lang="ts">
  import { onMount } from 'svelte';
  import vegaEmbed from 'vega-embed';

  const data = {
    data: {
      values: [
        { category: 'A', group: 'x', value: 0.1 },
        { category: 'A', group: 'y', value: 0.6 },
        { category: 'A', group: 'z', value: 0.9 },
        { category: 'B', group: 'x', value: 0.7 },
        { category: 'B', group: 'y', value: 0.2 },
        { category: 'B', group: 'z', value: 1.1 },
        { category: 'C', group: 'x', value: 0.6 },
        { category: 'C', group: 'y', value: 0.1 },
        { category: 'C', group: 'z', value: 0.2 },
      ],
    },
    mark: 'bar',
    encoding: {
      x: { field: 'category' },
      y: { field: 'value', type: 'quantitative' },
      xOffset: { field: 'group' },
      color: { field: 'group' },
    },
  };

  onMount(() => {
    vegaEmbed('#viz', data, { mode: 'vega-lite', actions: false });
  });
</script>

<div id="viz"></div>
