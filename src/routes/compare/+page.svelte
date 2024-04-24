<script>
  import Comparison from "../../components/Comparison.svelte";

  export let description = "Search Page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<Comparison />
