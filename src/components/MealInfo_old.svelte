<svelte:options tag="google-chart" />

<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { baseUrl, apiKey } from "../apiConfig.js";
  import Recipe from "./Recipe.svelte";
  import { selectedMeals } from "../store.js";
  import Spinner from "svelte-spinner";
  import { favoriteMeals } from "../store.js";
  import { toast } from '@zerodevx/svelte-toast'
  let isRecipeOpen = false; // Состояние для отслеживания видимости модального окна

  export let mealId;

  const mealInfo = writable(null);

  let instructions;
  let recipe;
  let readyInMinutes;
  let servings;
  let ingredients;

  let healthScore;
  let glycemicIndex;

  let proteinPercentage;
  let carbsPercentage;
  let fatPercentage;

  let caloriesAmount;
  let proteinAmount;
  let carbsAmount;
  let fatAmount;

  let caloriesOfDailyNeeds;
  let proteinOfDailyNeeds;
  let fatOfDailyNeeds;
  let carbsOfDailyNeeds;

  let vitamins = [];
  let minerals = [];
  let otherNutrients = [];

  const barChartData = [
    ["Nutrient", "Percentage", { role: "style" }],
    ["Protein", "", "rgb(39,103,85)"],
    ["Carbs", "", "rgb(83,165,174)"],
    ["Fat", "", "rgb(17,26,20)"],
  ];

  async function getmealInfo(id) {
    const url = `${baseUrl}/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    mealInfo.set(data);
    console.log("URL HERE", url);
    console.log("MEAL INFO", data);

    instructions = data.instructions;
    readyInMinutes = data.readyInMinutes;
    servings = data.servings;
    ingredients = data.extendedIngredients.map((item) => item.original);
    recipe = [servings, readyInMinutes, ingredients, instructions];

    healthScore = data.healthScore.toFixed(0);
    glycemicIndex = data.nutrition.properties.find(
      (property) => property.name === "Glycemic Index"
    ).amount;

    const nutrients = data.nutrition.nutrients;

    proteinPercentage = data.nutrition.caloricBreakdown.percentProtein;
    carbsPercentage = data.nutrition.caloricBreakdown.percentCarbs;
    fatPercentage = data.nutrition.caloricBreakdown.percentFat;

    caloriesOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Calories"
    ).percentOfDailyNeeds;

    proteinOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Protein"
    ).percentOfDailyNeeds;

    fatOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Fat"
    ).percentOfDailyNeeds;

    carbsOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Carbohydrates"
    ).percentOfDailyNeeds;

    caloriesAmount = nutrients.find(
      (nutrient) => nutrient.name === "Calories"
    ).amount;
    proteinAmount = nutrients.find(
      (nutrient) => nutrient.name === "Protein"
    ).amount;
    fatAmount = nutrients.find((nutrient) => nutrient.name === "Fat").amount;
    carbsAmount = nutrients.find(
      (nutrient) => nutrient.name === "Carbohydrates"
    ).amount;

    barChartData[1][1] = proteinOfDailyNeeds;
    barChartData[2][1] = carbsOfDailyNeeds;
    barChartData[3][1] = fatOfDailyNeeds;

    const requiredVitamins = [
      "Vitamin A",
      "Vitamin B1",
      "Vitamin B2",
      "Vitamin B3",
      "Vitamin B5",
      "Vitamin B6",
      "Vitamin B7",
      "Folate",
      "Vitamin B12",
      "Vitamin C",
      "Vitamin D",
      "Vitamin E",
      "Vitamin K",
    ];
    const requiredMinerals = [
      "Calcium",
      "Iron",
      "Magnesium",
      "Potassium",
      "Sodium",
      "Zinc",
      "Copper",
      "Manganese",
      "Phosphorus",
      "Selenium",
    ];
    const requiredOtherNutrients = ["Caffeine", "Sugar", "Alcohol", "Fiber"];

    nutrients.forEach((nutrient) => {
      // Проверяем, является ли текущий нутриент витамином
      if (requiredVitamins.includes(nutrient.name)) {
        // Добавляем витамин в массив vitamins
        vitamins.push(nutrient);
      }
      // Проверяем, является ли текущий нутриент минералом
      else if (requiredMinerals.includes(nutrient.name)) {
        // Добавляем минерал в массив minerals
        minerals.push(nutrient);
      } else if (requiredOtherNutrients.includes(nutrient.name)) {
        // Добавляем минерал в массив minerals
        otherNutrients.push(nutrient);
      }
    });
    vitamins.sort((a, b) => {
      // Сравниваем имена витаминов
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    console.log("Vitamins:", vitamins);
    console.log("Minerals:", minerals);
    drawPieChart();
    drawBarChart();

    return data;
  }

  function openRecipe() {
    isRecipeOpen = true;
  }

  $: numberOfSelectedMeals = $selectedMeals.length;
  // Создаем переменную состояния для отслеживания текущего режима отображения
  const viewMode = writable("percent"); // Изначально отображаем проценты

  let pieChartContainer;
  let barChartContainer;
  let pieChart;
  let barChart;
  let initialized = false;

  // Sample data for proteinPercentage, carbsPercentage, and fatPercentage

  const drawPieChart = () => {
    let data = new google.visualization.DataTable();

    data.addColumn("string", "Nutrient");
    data.addColumn("number", "Amount");
    data.addRows([
      ["Protein", proteinPercentage],
      ["Carbs", carbsPercentage],
      ["Fat", fatPercentage],
    ]);

    const grammFormatter = new google.visualization.NumberFormat({
      suffix: " g",
      pattern: "##.#",
    });
    grammFormatter.format(data, 1);

    let options = {
      width: 400,
      height: 400,
      legend: "none",

      slices: {
        0: { color: "rgb(39,103,85)" }, // Цвет сектора для Protein
        1: { color: "rgb(83,165,174)" }, // Цвет сектора для Carbs
        2: { color: "rgb(17,26,20)" }, // Цвет сектора для Fat
      },
      backgroundColor: "rgb(228,224,210)",
      pieSliceText: "percentage",
      tooltip: {
        text: "percentage",
        textStyle: {
          fontName: "Bitter",
          fontSize: 14,
          bold: true,
        },
      },
      pieSliceTextStyle: {
        fontName: "Bitter",
        fontSize: 16,
        bold: true,
      },
    };

    pieChart = new google.visualization.PieChart(pieChartContainer);
    pieChart.draw(data, options);
  };

  const drawBarChart = () => {
    const data = google.visualization.arrayToDataTable(barChartData);

    const percentFormatter = new google.visualization.NumberFormat({
      suffix: "% of daily norm",
      pattern: "##.#",
    });

    percentFormatter.format(data, 1);
    const options = {
      width: 400,
      height: 400,
      legend: { position: "none" },

      backgroundColor: "rgb(228,224,210)",
      tooltip: {
        isHtml: true,
        trigger: "hover",
        textStyle: {
          fontName: "Bitter",
          fontSize: 14, // Размер шрифта подсказки
          bold: true,
        },
      },
      vAxis: {
        viewWindow: { max: 100 },
        maxValue: 100,
        minValue: 0,
        textStyle: {
          fontName: "Bitter",
          fontSize: 14, // Размер шрифта подсказки
        },
      },
      hAxis: {
        textStyle: {
          fontName: "Bitter",
          fontSize: 14, // Размер шрифта подсказки
          bold: true,
        },
      },
    };

    barChart = new google.visualization.ColumnChart(barChartContainer);
    barChart.draw(data, options);
  };

  const initializeCharts = () => {
    if (typeof google === "undefined" || typeof google.charts === "undefined") {
      // Если библиотека Google Charts не загружена, ждем 100 миллисекунд и пытаемся инициализировать графики снова
      setTimeout(initializeCharts, 100);
      return;
    }

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      initialized = true;
      drawPieChart();
      drawBarChart();
    });
  };

  const addToComparison = ()  => {
    const isAlreadyInComparison = $selectedMeals.some(
      (meal) => meal.id === $mealInfo.id
    );

    // Если блюдо уже в списке сравнения, ничего не делаем
    if (isAlreadyInComparison) {
      toast.push('Meal is already in comparison!', {
      theme: { '--toastBackground': '#D52A25', '--toastColor': '#FFF' }
    });
      return;
    }

    selectedMeals.update((meals) => {
      return [...meals, $mealInfo];
    });
    toast.push('Meal added to comparison!', {
      theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
    });
   
  }

  const addToFavorites = () => {
    const isAlreadyInFavorites = $favoriteMeals.some(
      (meal) => meal.id === $mealInfo.id
    );

    // Если блюдо уже в избранном, ничего не делаем
    if (isAlreadyInFavorites) {
      toast.push('Meal is already in favorites!', {
      theme: { '--toastBackground': '#D52A25', '--toastColor': '#FFF' }
    });
      return;
    }
    // Добавление блюда в глобальное хранилище избранных блюд
    favoriteMeals.update((meals) => {
      return [...meals, $mealInfo];
    });
    toast.push('Meal added to favorites!', {
      theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
    });

  
  };

  

  onMount(() => {
    initializeCharts();
    const urlParams = new URLSearchParams(window.location.search);

    getmealInfo(mealId);
  });
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://www.gstatic.com/charts/loader.js"
    onload={initializeCharts}
  ></script>
</svelte:head>

{#if $mealInfo}
  <div class="justify-center pb-16 bg-mainBeige">
    <div class="flex gap-16 max-lg:flex-col max-lg:items-center max-lg:gap-0">
      <div
        class="flex flex-col w-1/3 max-lg:w-full max-lg:items-center max-lg:px-16 max-sm:px-8"
      >
        <img
          loading="lazy"
          src="https://img.spoonacular.com/recipes/{$mealInfo.id}-636x393.{$mealInfo.imageType}"
          alt="Meal"
          class="w-full mt-8 mx-16 max-lg:max-w-full"
        />
      </div>
      <div class="flex flex-col lg:ml-6 w-1/2 max-lg:w-full max-lg:px-8">
        <div
          class="flex flex-col grow justify-center py-8 max-lg:mt-10 max-lg:max-w-full"
        >
          <div
            class="flex max-lg:flex-col max-lg:gap-6 justify-between items-start border-l-2 border-solid border-l-black"
          >
            <h1
              class="justify-center px-8 text-xl sm:text-xxl font-bold leading-10 text-black max-lg:pl-6 max-lg:max-w-full"
            >
              {#if $mealInfo.servings === 1}
                {$mealInfo.title} (1 serving)
              {:else}
                {$mealInfo.title} ({servings} servings)
              {/if}
            </h1>
          </div>
        </div>

        <div
          class="flex flex-col grow justify-center font-bold max-md:mt-10 max-md:max-w-full"
        >
          <div
            class="flex gap-6 max-md:flex-wrap font-bitter max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {caloriesAmount.toFixed(0)}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div
                class="text-xl sm:text-xxl leading-10 {healthScore > 75
                  ? 'text-mainGreen'
                  : healthScore < 25
                    ? 'text-mainRed'
                    : 'text-black'}"
              >
                {healthScore}
              </div>
              <div class="flex flex-row">
                <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                  Health Score
                </div>
                <img
                  src="..\src\assets\icons\info.svg"
                  alt="Info icon"
                  class="w-6 aspect-square ml-2 mt-2 icon"
                  title="Score % (between 0 and 100) = Average coverage of good nutrients - Average coverage of bad nutrients. That is, the more of your daily requirements of vitamins and minerals are covered and lower amounts of things you should limit (sugar, salt etc.) the higher the score."
                />
              </div>
            </div>
          </div>
          <div
            class="flex gap-6 mt-12 max-md:flex-wrap font-bitter max-md:mt-10 max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {caloriesOfDailyNeeds.toFixed(0)}%
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                of daily norm of calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {glycemicIndex.toFixed(0)}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Glycemic index
              </div>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row lg:-mr-16 font-normal"></div>
        </div>
      </div>
    </div>
    <div class="flex md:flex-row flex-col">
      {#if numberOfSelectedMeals < 2}
        <button
          class="mx-auto mt-16 flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
          on:click={addToComparison}
        >
          <span>Add to comparison</span>
          <img
            src="..\src\assets\icons\scales.svg"
            alt="Comparison icon"
            class="ml-2 w-6 aspect-square invert"
          />
        </button>
      {:else}
        <button
          class="mx-auto mt-16 flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
        >
          <a href="/compare">Compare</a>
        </button>
      {/if}
      <button
        class="mx-auto mt-16 flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
        on:click={addToFavorites}
      >
        <span>Add to favorites</span>
        <img
          src="..\src\assets\icons\love.svg"
          alt="Favorites icon"
          class="ml-2 w-6 aspect-square invert"
        />
      </button>
      <button
        class="mx-auto mt-16 flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
        on:click={openRecipe}
      >
        <span>Open recipe</span>
      </button>
      {#if isRecipeOpen}
        <Recipe fullRecipe={recipe} onClose={() => (isRecipeOpen = false)} />
      {/if}
    </div>
  </div>
{:else}
  <Spinner size="middle" />
{/if}

<div class="flex flex-col items-center pb-12 bg-mainBeige px-16">
  <div
    class="shrink-0 self-stretch h-px bg-black border border-black border-solid max-md:max-w-full"
  ></div>
  <h1
    class="mt-12 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:mt-10 max-md:max-w-full"
  >
    Caloric Breakdown / Daily Needs
  </h1>
  <div
    class="flex justify-center items-center self-stretch mt-12 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full"
  >
    <div class="max-w-full">
      <div class="flex gap-4 max-lg:flex-col max-lg:gap-0">
        <div class="flex flex-col w-2/3 max-lg:w-full">
          {#if $mealInfo}
            <div
              class="flex flex-col self-stretch my-auto text-xl leading-8 text-black max-lg:mt-10 max-lg:max-w-full"
            >
              <div class="flex gap-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-mainGreen"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Protein</span> - {proteinAmount.toFixed(
                    0
                  )} g ({proteinOfDailyNeeds.toFixed(0)}% of daily norm)
                </div>
              </div>
              <div class="flex gap-4 mt-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-mainBlue"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Carbs</span> - {carbsAmount.toFixed(
                    0
                  )} g ({carbsOfDailyNeeds.toFixed(0)}% of daily norm)
                </div>
              </div>
              <div class="flex gap-4 mt-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-black"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Fat</span> - {fatAmount.toFixed(0)} g ({fatOfDailyNeeds.toFixed(
                    0
                  )}% of daily norm)
                </div>
              </div>
            </div>
          {:else}
            Loading
          {/if}
        </div>
        <div
          class="flex flex-col w-1/3 items-center max-lg:w-full chart-container"
        >
          <div bind:this={pieChartContainer}></div>
        </div>
        <div
          class="flex flex-col w-1/3 items-center max-lg:w-full chart-container"
        >
          <div bind:this={barChartContainer}></div>
        </div>
      </div>
    </div>
  </div>
</div>
{#if $mealInfo}
  <div class="flex font-bitter flex-col">
    <div
      class="flex flex-col items-center px-16 pb-12 w-full bg-mainBeige max-md:px-4 max-md:max-w-full"
    >
      <div
        class="shrink-0 self-stretch h-px bg-black border border-black border-solid max-md:max-w-full"
      ></div>
      <div
        class="flex flex-row sm:items-start justify-center sm:justify-start pt-4 mt-6 leading-6"
      >
        <button
          class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid hover:bg-mainGreen hover:text-white cursor-pointer"
          on:click={() => viewMode.set("percent")}
          class:selected={$viewMode === "percent"}
        >
          Of your daily norm
        </button>
        <button
          class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-mainGreen hover:text-white cursor-pointer"
          on:click={() => viewMode.set("weight")}
          class:selected={$viewMode === "weight"}
        >
          Weight
        </button>
      </div>
      <div
        class="mt-12 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:mt-10 max-md:max-w-full"
      >
        Vitamins
      </div>
      <div
        class="justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class="grid grid-cols-2 mx-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each vitamins as { name, amount, unit, percentOfDailyNeeds }}
            <div
              class="flex flex-col justify-center font-bold max-md:mt-10 max-md:max-w-full"
            >
              <div class="flex gap-6 max-md:flex-wrap max-md:max-w-full">
                <div
                  class="flex flex-col items-start pl-4 sm:pl-8 border-l-2 border-solid border-l-black"
                >
                  <!-- В зависимости от режима просмотра выводим проценты или абсолютные значения -->
                  {#if $viewMode === "percent"}
                    <div
                      class="text-xl sm:text-xxl leading-10 {percentOfDailyNeeds ===
                      Math.max(...vitamins.map((v) => v.percentOfDailyNeeds))
                        ? 'text-mainGreen'
                        : 'text-black'}"
                    >
                      {percentOfDailyNeeds.toFixed(0)}%
                    </div>
                  {:else if $viewMode === "weight"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {amount.toFixed(0)}
                      {unit}
                    </div>
                  {/if}
                  <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                    {name}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div
        class="mt-16 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:max-w-full"
      >
        Minerals
      </div>
      <div
        class="justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class="grid grid-cols-2 mx-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each minerals as { name, amount, unit, percentOfDailyNeeds }}
            <div
              class="flex flex-col justify-center font-bold max-md:mt-10 max-md:max-w-full"
            >
              <div class="flex gap-6 max-md:flex-wrap max-md:max-w-full">
                <div
                  class="flex flex-col items-start pl-4 sm:pl-8 border-l-2 border-solid border-l-black"
                >
                  <!-- В зависимости от режима просмотра выводим проценты или абсолютные значения -->
                  {#if $viewMode === "percent"}
                    <div
                      class="text-xl sm:text-xxl leading-10 {percentOfDailyNeeds ===
                      Math.max(...minerals.map((m) => m.percentOfDailyNeeds))
                        ? 'text-mainGreen'
                        : 'text-black'}"
                    >
                      {percentOfDailyNeeds.toFixed(0)}%
                    </div>
                  {:else if $viewMode === "weight"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {amount.toFixed(0)}
                      {unit}
                    </div>
                  {/if}
                  <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                    {name}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div
        class="mt-16 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:max-w-full"
      >
        General nutrients
      </div>
      <div
        class="justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class="grid grid-cols-2 mx-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each otherNutrients as { name, amount, unit, percentOfDailyNeeds }}
            <div
              class="flex flex-col justify-center font-bold max-md:mt-10 max-md:max-w-full"
            >
              <div class="flex gap-6 max-md:flex-wrap max-md:max-w-full">
                <div
                  class="flex flex-col items-start pl-4 sm:pl-8 border-l-2 border-solid border-l-black"
                >
                  <!-- В зависимости от режима просмотра выводим проценты или абсолютные значения -->
                  {#if $viewMode === "percent"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {percentOfDailyNeeds.toFixed(0)}%
                    </div>
                  {:else if $viewMode === "weight"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {amount.toFixed(0)}
                      {unit}
                    </div>
                  {/if}
                  <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                    {name}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  Loading
{/if}

<style>
  .selected {
    background-color: rgb(17, 26, 20);
    color: white;
  }

  .icon:hover {
    cursor: pointer;
  }

  .chart-container {
    z-index: 999; /* Установите значение z-index ниже, чем у модального окна */
    /* Добавьте другие стили для графиков */
  }
</style>
