<script>
  import { page } from "$app/stores";
  import MealInfo from "../../../components/MealInfo.svelte";
  const mealId = $page.params.mealId;
</script>

<MealInfo {mealId} />
