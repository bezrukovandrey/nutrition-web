<script>
  import { page } from "$app/stores";
  const quizId = $page.params.quizId;
  import QuizActive from "../../../components/QuizActive.svelte";
</script>

<QuizActive {quizId} />
