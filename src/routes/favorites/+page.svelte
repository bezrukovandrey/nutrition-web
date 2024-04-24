<script>
  import Favorites from "../../components/Favorites.svelte";

  export let description = "Favorites page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<Favorites />
