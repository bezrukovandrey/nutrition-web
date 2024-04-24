<script>
  import Greeting from "../components/Greeting.svelte";
  import Info1 from "../components/Info1.svelte";
  import Info2 from "../components/Info2.svelte";
  import FAQ from "../components/FAQ.svelte";

  export let description = "Main page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<Greeting />
<Info1 />
<Info2 />
<FAQ />
