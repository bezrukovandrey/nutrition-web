<script>
  import MealPlan from "../../components/MealPlan.svelte";

  export let description = "Meal plan page";
</script>

<svelte:head>
  <meta name="description" content={description} />
</svelte:head>

<MealPlan />
