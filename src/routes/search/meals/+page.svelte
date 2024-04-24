<script>
  import SearchMeals from "../../../components/SearchMeals.svelte";
  import SearchResult from "../../../components/SearchResult.svelte";

  export let description = "Search meals page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<SearchMeals />
<SearchResult />
