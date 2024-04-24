<script>
  import ProfileForm from "../../components/ProfileForm.svelte";

  export let description = "Profile page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<ProfileForm />
