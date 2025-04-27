<svelte:options tag="google-chart" />

<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { baseUrl, apiKey } from "../apiConfig.js";
  import Spinner from "svelte-spinner";
  import { favoriteProducts } from "../store.js";
  import { toast } from '@zerodevx/svelte-toast';
  import { userDataStore } from "../store.js";

  

  export let productId;

  const userData = $userDataStore;
  const ratio = userData && typeof userData.totalCalories === 'number' && userData.totalCalories !== 0 ? userData.totalCalories / 2000 : 1;
  const productInfo = writable(null);
  const defaultAmount = writable(100); 
  const defaultUnit = writable("g");

  let nutritionScore;
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

  async function getProductInfo(id) {
    const amount = $defaultAmount; 
    const unit = $defaultUnit;
    const url = `${baseUrl}/food/ingredients/${id}/information?amount=${amount}&unit=${unit}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    productInfo.set(data);
    console.log("URL HERE", url);
    console.log("PRODUCT INFO", data);

    nutritionScore = parseFloat(
      data.nutrition.properties.find(
        (property) => property.name === "Nutrition Score"
      ).amount
    ).toFixed(1);
    glycemicIndex = data.nutrition.properties.find(
      (property) => property.name === "Glycemic Index"
    ).amount;

    const nutrients = data.nutrition.nutrients;

    proteinPercentage = data.nutrition.caloricBreakdown.percentProtein;
    carbsPercentage = data.nutrition.caloricBreakdown.percentCarbs;
    fatPercentage = data.nutrition.caloricBreakdown.percentFat;

    caloriesOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Calories"
    ).percentOfDailyNeeds / ratio;

    proteinOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Protein"
    ).percentOfDailyNeeds / ratio;

    fatOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Fat"
    ).percentOfDailyNeeds / ratio;

    carbsOfDailyNeeds = nutrients.find(
      (nutrient) => nutrient.name === "Carbohydrates"
    ).percentOfDailyNeeds / ratio;

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

    vitamins = [];
    minerals = [];
    otherNutrients = [];

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
      if (requiredVitamins.includes(nutrient.name)) {

        vitamins.push(nutrient);
      }
      else if (requiredMinerals.includes(nutrient.name)) {

        minerals.push(nutrient);
      } else if (requiredOtherNutrients.includes(nutrient.name)) {

        otherNutrients.push(nutrient);
      }
    });
    vitamins.sort((a, b) => {
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

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      
      getProductInfo(productId);
    }
  }

  function handleUnitChange(event) {
    const unit = event.target.value; 
    $defaultUnit = unit; 
    getProductInfo(productId); 
  }

  const addToFavorites = () => {
    const isAlreadyInFavorites = $favoriteProducts.some(
      (meal) => meal.id === $productInfo.id
    );

    if (isAlreadyInFavorites) {
      toast.push('Product is already in favorites!', {
      theme: { '--toastBackground': '#D52A25', '--toastColor': '#FFF' }
    });
      return;
    }
    favoriteProducts.update((products) => {
      
      return [...products, $productInfo];
      
    });
    toast.push('Product added to favorites!', {
      theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
    });
  };

 
  const viewMode = writable("percent"); 

  let pieChartContainer;
  let barChartContainer;
  let pieChart;
  let barChart;
  let initialized = false;


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
        0: { color: "rgb(39,103,85)" },
        1: { color: "rgb(83,165,174)" }, 
        2: { color: "rgb(17,26,20)" }, 
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
          fontSize: 14, 
          bold: true,
        },
      },
      vAxis: {
        viewWindow: { max: 100 },
        maxValue: 100,
        minValue: 0,
        textStyle: {
          fontName: "Bitter",
          fontSize: 14, 
        },
      },
      hAxis: {
        textStyle: {
          fontName: "Bitter",
          fontSize: 14, 
          bold: true,
        },
      },
    };

    barChart = new google.visualization.ColumnChart(barChartContainer);
    barChart.draw(data, options);
  };

  const initializeCharts = () => {
    if (typeof google === "undefined" || typeof google.charts === "undefined") {
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

  onMount(() => {
    initializeCharts();
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get("amount") || 100; 
    const unit = urlParams.get("unit") || "g";
    $defaultAmount = amount;
    $defaultUnit = unit;
    getProductInfo(productId);
  });
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://www.gstatic.com/charts/loader.js"
    onload={initializeCharts}
  ></script>
</svelte:head>
{#if $productInfo}
  <div class="justify-center pb-16 bg-mainBeige">
    <div class="flex gap-16 max-md:flex-col max-md:gap-0">
      <div
        class="flex flex-col w-1/3 max-md:ml-0 max-md:w-full max-md:items-center max-md:px-16"
      >
        <img
          src="https://img.spoonacular.com/ingredients_500x500/{$productInfo.image}"
          alt="Product"
          class="w-full mt-8 mx-16 max-md:max-w-full border-2 border border-darkGreen"
        />
      </div>
      <div class="flex flex-col lg:ml-6 w-1/2 max-lg:w-full max-lg:px-8">
        <div
          class="flex flex-col grow justify-center py-8 max-md:mt-10 max-md:max-w-full"
        >
          <div
            class="flex max-lg:flex-col max-lg:gap-6 justify-between items-start border-l-2 border-solid border-l-black"
          >
            <h1
              class="justify-center capitalize px-8 text-xl sm:text-xxl font-bold leading-10 text-black max-md:max-w-full"
            >
              {$productInfo.name}
            </h1>
            <div
              class="flex gap-6 justify-center mx-6 text-base leading-6 text-neutral-600 max-md:flex-wrap max-md:mr-3"
            >
              <div class="my-auto text-sm sm:text-m text-black">
                Nutrients in
              </div>
              <div class="flex items-center">
                <input
                  type="text"
                  class="p-4 w-20 bg-white border border-black border-solid"
                  bind:value={$defaultAmount}
                  on:keydown={handleInputKeyDown}
                />
                <div class="relative ml-2">
                  <select
                    class="p-4 w-20 pr-6 bg-white border border-black border-solid appearance-none"
                    bind:value={$defaultUnit}
                    on:change={handleUnitChange}
                  >
                    {#if $productInfo}
                      {#each $productInfo.possibleUnits as unit}
                        <option value={unit}>{unit}</option>
                      {/each}
                    {/if}
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
                  >
                    <img
                      src="/arrow_down.svg"
                      alt="Select unit icon"
                      class="w-6 aspect-square"
                    />
                  </div>
                </div>
              </div>
            </div>
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
                {caloriesAmount}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {nutritionScore}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Nutrition Score
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
                {caloriesOfDailyNeeds.toFixed(1)}%
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                of your daily norm of calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {glycemicIndex}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Glycemic index
              </div>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row lg:-mr-16 font-normal">
            <button
              class="mx-auto mt-16 flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
              on:click={addToFavorites}
            >
              <span>Add to favorites</span>
              <img
                src="/icons/love.svg"
                alt="Favorites icon"
                class="ml-2 w-6 aspect-square invert"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
<div class="absolute inset-0 flex items-center justify-center bg-mainGray">
  <Spinner 
    size="50" 
    color="#F5F5DC"
    speed="1" 
    class="opacity-75"
  />
</div>
{/if}

<div class="flex flex-col items-center pb-12 bg-mainBeige px-4 sm:px-16">
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
          {#if $productInfo}
            <div
              class="flex flex-col self-stretch my-auto text-xl leading-8 text-black max-lg:mt-10 max-lg:max-w-full"
            >
              <div class="flex gap-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-mainGreen"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Protein</span> - {proteinAmount.toFixed(1)} g ({proteinOfDailyNeeds.toFixed(1)}%
                  of daily norm)
                </div>
              </div>
              <div class="flex gap-4 mt-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-mainBlue"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Carbs</span> - {carbsAmount.toFixed(1)} g ({carbsOfDailyNeeds.toFixed(1)}%
                  of daily norm)
                </div>
              </div>
              <div class="flex gap-4 mt-4 max-lg:flex-wrap">
                <div class="shrink-0 my-auto w-12 h-2 bg-black"></div>
                <div class="flex-1 text-sm sm:text-m max-lg:max-w-full">
                  <span class="font-bold">Fat</span> - {fatAmount.toFixed(1)} g ({fatOfDailyNeeds.toFixed(1)}%
                  of daily norm)
                </div>
              </div>
            </div>
          {:else}
            Loading
          {/if}
        </div>
        <div class="flex flex-col w-1/3 items-center max-lg:w-full">
          <div bind:this={pieChartContainer}></div>
        </div>
        <div class="flex flex-col w-1/3 items-center max-lg:w-full">
          <div bind:this={barChartContainer}></div>
        </div>
      </div>
    </div>
  </div>
</div>
{#if $productInfo}
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
                  
                  {#if $viewMode === "percent"}
                    <div
                      class="text-xl sm:text-xxl leading-10 {percentOfDailyNeeds ===
                      Math.max(...vitamins.map((v) => v.percentOfDailyNeeds))
                        ? 'text-mainGreen'
                        : 'text-black'}"
                    >
                      {percentOfDailyNeeds.toFixed(1)}%
                    </div>
                  {:else if $viewMode === "weight"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {amount.toFixed(1)}
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
                 
                  {#if $viewMode === "percent"}
                    <div
                      class="text-xl sm:text-xxl leading-10 {percentOfDailyNeeds ===
                      Math.max(...minerals.map((m) => m.percentOfDailyNeeds))
                        ? 'text-mainGreen'
                        : 'text-black'}"
                    >
                      {percentOfDailyNeeds.toFixed(1)}%
                    </div>
                  {:else if $viewMode === "weight"}
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {amount.toFixed(1)}
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
</style>
