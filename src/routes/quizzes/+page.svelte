<script>
  import QuizGreeting from "../../components/QuizGreeting.svelte";
  import QuizList from "../../components/QuizList.svelte";

  export let description = "List of quizzes page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<QuizGreeting />
<QuizList />
