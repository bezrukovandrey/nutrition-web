<script>
  import { page } from "$app/stores";
  import QuizResults from "../../../../components/QuizResults.svelte";
  const quizId = $page.params.quizId;
  
</script>

<QuizResults {quizId} />
