<script>
  import SearchProducts from "../../../components/SearchProducts.svelte";
  import SearchResult from "../../../components/SearchResult.svelte";

  export let description = "Search products page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<SearchProducts />
<SearchResult />
