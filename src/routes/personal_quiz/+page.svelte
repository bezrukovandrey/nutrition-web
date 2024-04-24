<script>
  import PersonalQuizActive from "../../components/PersonalQuizActive.svelte";

  export let description = "Profile page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<PersonalQuizActive />
