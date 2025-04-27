<script>
  import { page } from "$app/stores";
  import QuizActive from "../../../components/QuizActive.svelte";
  const quizId = $page.params.quizId;
</script>

<QuizActive {quizId} />
