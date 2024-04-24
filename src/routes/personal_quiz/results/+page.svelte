<script>
  import PersonalQuizResults from "../../../components/PersonalQuizResults.svelte";

  export let description = "Profile page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<PersonalQuizResults />
