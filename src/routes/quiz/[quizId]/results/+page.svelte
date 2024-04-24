<script>
  import { page } from "$app/stores";
  const quizId = $page.params.quizId;
  import QuizResults from "../../../../components/QuizResults.svelte";
</script>

<QuizResults {quizId} />
