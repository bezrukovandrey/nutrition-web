<svelte:options tag="google-chart" />

<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { selectedMeals, userDataStore } from "../store.js";


  let meals = [];
  let mealInfo1 = writable({});
  let mealInfo2 = writable({});

  
  const viewMode = writable("percent"); 
  const userData = $userDataStore;
  const ratio = userData && typeof userData.totalCalories === 'number' && userData.totalCalories !== 0 ? userData.totalCalories / 2000 : 1;

  let pieChartContainer1;
  let barChartContainer1;
  let pieChart1;
  let barChart1;
  let pieChartContainer2;
  let barChartContainer2;
  let pieChart2;
  let barChart2;
  let initialized = false;


  const barChartData1 = [
    ["Nutrient", "Percentage", { role: "style" }],
    ["Protein", "", "rgb(39,103,85)"],
    ["Carbs", "", "rgb(83,165,174)"],
    ["Fat", "", "rgb(17,26,20)"],
  ];
  const barChartData2 = [
    ["Nutrient", "Percentage", { role: "style" }],
    ["Protein", "", "rgb(39,103,85)"],
    ["Carbs", "", "rgb(83,165,174)"],
    ["Fat", "", "rgb(17,26,20)"],
  ];

  function updateBarChartData1() {
    barChartData1[1][1] = parseFloat($mealInfo1.proteinOfDailyNeeds.toFixed(0));
    barChartData1[2][1] = parseFloat($mealInfo1.carbsOfDailyNeeds.toFixed(0));
    barChartData1[3][1] = parseFloat($mealInfo1.fatOfDailyNeeds.toFixed(0));

    drawBarChart1(); 
  }

  
  function updateBarChartData2() {
    barChartData2[1][1] = parseFloat($mealInfo2.proteinOfDailyNeeds.toFixed(0));
    barChartData2[2][1] = parseFloat($mealInfo2.carbsOfDailyNeeds.toFixed(0));
    barChartData2[3][1] = parseFloat($mealInfo2.fatOfDailyNeeds.toFixed(0));

    drawBarChart2(); 
  }
  const drawPieChart1 = () => {
    let data = new google.visualization.DataTable();

    data.addColumn("string", "Nutrient");
    data.addColumn("number", "Amount");
    data.addRows([
      ["Protein", parseFloat($mealInfo1.proteinPercentage)],
      ["Carbs", parseFloat($mealInfo1.carbsPercentage)],
      ["Fat", parseFloat($mealInfo1.fatPercentage)],
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

    pieChart1 = new google.visualization.PieChart(pieChartContainer1);
    pieChart1.draw(data, options);
  };

  const drawPieChart2 = () => {
    let data = new google.visualization.DataTable();

    data.addColumn("string", "Nutrient");
    data.addColumn("number", "Amount");
    data.addRows([
      ["Protein", parseFloat($mealInfo2.proteinPercentage)],
      ["Carbs", parseFloat($mealInfo2.carbsPercentage)],
      ["Fat", parseFloat($mealInfo2.fatPercentage)],
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

    pieChart2 = new google.visualization.PieChart(pieChartContainer2);
    pieChart2.draw(data, options);
  };

  const drawBarChart1 = () => {
    const data = google.visualization.arrayToDataTable(barChartData1);

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

    barChart1 = new google.visualization.ColumnChart(barChartContainer1);
    barChart1.draw(data, options);
  };

  const drawBarChart2 = () => {
    const data = google.visualization.arrayToDataTable(barChartData2);

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

    barChart2 = new google.visualization.ColumnChart(barChartContainer2);
    barChart2.draw(data, options);
  };

  const initializeCharts = () => {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      initialized = true;
      drawPieChart1();
      drawBarChart1();
      drawPieChart2();
      drawBarChart2();
      updateBarChartData1();
      updateBarChartData2();
    });
  };

  function goBack() {
    selectedMeals.set([]);
    goto("/search/meals");
  }

  function processData(data) {
    const title = data.title;
    const id = data.id;
    const imageType = data.imageType;
    const instructions = data.instructions;
    const readyInMinutes = data.readyInMinutes;
    const servings = data.servings;
    const ingredients = data.extendedIngredients.map((item) => item.original);
    const recipe = [servings, readyInMinutes, ingredients, instructions];

    const healthScore = data.healthScore.toFixed(0);
    const glycemicIndex = data.nutrition.properties
      .find((property) => property.name === "Glycemic Index")
      .amount.toFixed(0);

    const nutrients = data.nutrition.nutrients;

    const proteinPercentage =
      data.nutrition.caloricBreakdown.percentProtein.toFixed(0);
    const carbsPercentage =
      data.nutrition.caloricBreakdown.percentCarbs.toFixed(0);
    const fatPercentage = data.nutrition.caloricBreakdown.percentFat.toFixed(0);

    const caloriesOfDailyNeeds = Math.round(nutrients
      .find((nutrient) => nutrient.name === "Calories")
      .percentOfDailyNeeds / ratio);
    const proteinOfDailyNeeds = Math.round( nutrients
      .find((nutrient) => nutrient.name === "Protein")
      .percentOfDailyNeeds / ratio);
    const fatOfDailyNeeds = Math.round( nutrients
      .find((nutrient) => nutrient.name === "Fat")
      .percentOfDailyNeeds / ratio);
    const carbsOfDailyNeeds = Math.round(nutrients
      .find((nutrient) => nutrient.name === "Carbohydrates")
      .percentOfDailyNeeds / ratio);

    const caloriesAmount = nutrients
      .find((nutrient) => nutrient.name === "Calories")
      .amount.toFixed(0);
    const proteinAmount = nutrients
      .find((nutrient) => nutrient.name === "Protein")
      .amount.toFixed(0);
    const fatAmount = nutrients
      .find((nutrient) => nutrient.name === "Fat")
      .amount.toFixed(0);
    const carbsAmount = nutrients
      .find((nutrient) => nutrient.name === "Carbohydrates")
      .amount.toFixed(0);

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

    const vitamins = [];
    const minerals = [];
    const otherNutrients = [];

    nutrients.forEach((nutrient) => {
      if (requiredVitamins.includes(nutrient.name)) {
        vitamins.push(nutrient);
      } else if (requiredMinerals.includes(nutrient.name)) {
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

    minerals.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    otherNutrients.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return {
      title,
      id,
      imageType,
      instructions,
      readyInMinutes,
      servings,
      ingredients,
      recipe,
      healthScore,
      glycemicIndex,
      vitamins,
      minerals,
      otherNutrients,
      proteinPercentage,
      carbsPercentage,
      fatPercentage,
      caloriesOfDailyNeeds,
      proteinOfDailyNeeds,
      fatOfDailyNeeds,
      carbsOfDailyNeeds,
      caloriesAmount,
      proteinAmount,
      fatAmount,
      carbsAmount,
    };
  }
  let unsubscribeSelectedMeals;

  onMount(() => {
    initializeCharts();
    unsubscribeSelectedMeals = selectedMeals.subscribe((value) => {
      meals = value;
      if (meals.length >= 2) {
        mealInfo1.set(processData(meals[0]));
        mealInfo2.set(processData(meals[1]));
        updateBarChartData1();
        updateBarChartData2();
      }
    });
  });

  onDestroy(() => {
   
    if (unsubscribeSelectedMeals) {
      unsubscribeSelectedMeals();
    }
  });
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://www.gstatic.com/charts/loader.js"
    onload={initializeCharts}
  ></script>
</svelte:head>

<div
  class="flex flex-col items-center justify-center py-10 gap-6 w-full mx-auto bg-mainBeige"
>
  <h1
    class="text-xl sm:text-xxl font-bold leading-10 text-center text-black max-md:max-w-full"
  >
    Comparison
  </h1>
</div>

<div class="flex flex-row bg-mainBeige justify-center px-4">
  {#if $mealInfo1}
    <div class=" justify-between pb-16 w-full max-md:flex-col">
      <div
        class="flex flex-col gap-16 max-md:gap-0 max-sm:w-full max-md:ml-0 max-md:px-4 max-md:items-center"
      >
        <img
          src="https://img.spoonacular.com/recipes/{$mealInfo1.id}-636x393.{$mealInfo1.imageType}"
          alt="{$mealInfo1.title} image"
          class="w-4/5 sm:w-1/2 mt-8 max-md:max-w-full self-center aspect-square border-2 border border-darkGreen"
        />
      </div>
      <div class="flex flex-col lg:w-full items-center max-md:w-full">
        <div
          class="flex flex-col grow justify-center py-8 max-md:mt-10 max-md:max-w-full whitespace-normal"
        >
          <div
            class="flex max-lg:flex-col max-lg:gap-6 justify-between items-center border-l-2 border-solid border-l-black"
          >
            <h1
              class="justify-center px-8 text-xl sm:text-xxl font-bold leading-10 text-black max-md:pl-4 max-md:max-w-full"
            >
              {$mealInfo1.title} ({$mealInfo1.servings} serv.)
            </h1>
          </div>
          <div
            class="flex gap-6 max-sm:flex-col pt-6 font-bitter max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo1.caloriesAmount}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div
                class="text-xl sm:text-xxl leading-10 {$mealInfo1.healthScore >
                75
                  ? 'text-mainGreen'
                  : $mealInfo1.healthScore < 25
                    ? 'text-mainRed'
                    : 'text-black'}"
              >
                {$mealInfo1.healthScore}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Health Score
              </div>
            </div>
          </div>
          <div
            class="flex gap-6 mt-12 max-sm:flex-col font-bitter max-md:mt-10 max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo1.caloriesOfDailyNeeds}%
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                of your daily norm of calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo1.glycemicIndex}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Glycemic Index
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if $mealInfo2}
    <div class="justify-between pb-16 w-full max-md:flex-col">
      <div
        class="flex flex-col gap-16 max-md:gap-0 max-sm:w-full max-md:ml-0 max-md:px-4 max-md:items-center"
      >
        <img
          src="https://img.spoonacular.com/recipes/{$mealInfo2.id}-636x393.{$mealInfo2.imageType}"
          alt="{$mealInfo2.title} image"
          class="w-4/5 sm:w-1/2 mt-8 max-md:max-w-full self-center aspect-square border-2 border border-darkGreen"
        />
      </div>
      <div class="flex flex-col items-center lg:w-full max-md:w-full">
        <div
          class="flex flex-col grow justify-center py-8 max-md:mt-10 max-md:max-w-full whitespace-normal"
        >
          <div
            class="flex max-lg:flex-col max-lg:gap-6 justify-between items-center border-l-2 border-solid border-l-black"
          >
            <h1
              class="justify-center px-8 text-xl sm:text-xxl font-bold leading-10 text-black max-md:pl-4 max-md:max-w-full"
            >
              {$mealInfo2.title} ({$mealInfo2.servings} serv.)
            </h1>
          </div>
          <div
            class="flex gap-6 max-sm:flex-col pt-6 font-bitter max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo2.caloriesAmount}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div
                class="text-xl sm:text-xxl leading-10 {$mealInfo2.healthScore >
                75
                  ? 'text-mainGreen'
                  : $mealInfo2.healthScore < 25
                    ? 'text-mainRed'
                    : 'text-black'}"
              >
                {$mealInfo2.healthScore}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Health Score
              </div>
            </div>
          </div>
          <div
            class="flex gap-6 mt-12 max-sm:flex-col font-bitter max-md:mt-10 max-md:max-w-full"
          >
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo2.caloriesOfDailyNeeds}%
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                of your daily norm of calories
              </div>
            </div>
            <div
              class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
            >
              <div class="text-xl sm:text-xxl leading-10 text-black">
                {$mealInfo2.glycemicIndex}
              </div>
              <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                Glycemic Index
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<div class="flex flex-col items-center pb-12 bg-mainBeige px-16">
  <div
    class="shrink-0 self-stretch h-px bg-black border border-black border-solid max-md:max-w-full"
  ></div>
  <h1
    class="mt-12 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:mt-10 max-md:max-w-full"
  >
    Caloric Breakdown
  </h1>
  <div class="flex flex-col lg:flex-row">
    {#if $mealInfo1}
      <div
        class="flex justify-center items-center self-stretch px-16 mt-12 w-full max-md:px-4 max-md:mt-10 max-md:max-w-full"
      >
        <div class="w-full max-md:max-w-full text-center">
          <h1
            class="lg:hidden justify-center max-lg:mb-4 text-xl sm:text-xxl font-bold leading-10 text-black max-md:max-w-full"
          >
            {$mealInfo1.title}
          </h1>
          <div class="flex gap-6 flex-col max-md:gap-0">
            <div class="flex flex-col max-md:ml-0 w-full">
              <div
                class="flex flex-col self-stretch py-2 my-auto text-xl leading-8 text-black max-md:mt-10 max-md:max-w-full"
              >
                <div class="flex gap-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-mainGreen"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Protein</span> - {$mealInfo1.proteinAmount}
                    g ({barChartData1[1][1]}% of daily norm)
                  </div>
                </div>
                <div class="flex gap-4 mt-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-mainBlue"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Carbs</span> - {$mealInfo1.carbsAmount}
                    g ({barChartData1[2][1]}% of daily norm)
                  </div>
                </div>
                <div class="flex gap-4 mt-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-darkGreen"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Fat</span> - {$mealInfo1.fatAmount} g
                    ({barChartData1[3][1]}% of daily norm)
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-1/3 max-lg:w-full">
              <div bind:this={pieChartContainer1}></div>
            </div>
            <div class="flex -mt-16 flex-col w-1/3 max-lg:w-full">
              <div bind:this={barChartContainer1}></div>
            </div>
          </div>
        </div>
      </div>
    {/if}
    {#if $mealInfo2}
      <div
        class="flex justify-centeritems-center self-stretch px-16 mt-12 w-full max-md:px-4 max-md:mt-10 max-md:max-w-full"
      >
        <div class="w-full max-md:max-w-full text-center">
          <h1
            class="mt-4 lg:hidden max-lg:mb-4 justify-center text-xl sm:text-xxl font-bold leading-10 text-black max-md:max-w-full"
          >
            {$mealInfo2.title}
          </h1>
          <div class="flex gap-6 flex-col max-md:gap-0">
            <div class="flex flex-col w-full max-md:ml-0">
              <div
                class="flex flex-col self-stretch py-2 my-auto text-xl leading-8 text-black max-md:mt-10 max-md:max-w-full"
              >
                <div class="flex gap-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-mainGreen"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Protein</span> - {$mealInfo2.proteinAmount}
                    g ({barChartData2[1][1]}% of daily norm)
                  </div>
                </div>
                <div class="flex gap-4 mt-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-mainBlue"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Carbs</span> - {$mealInfo2.carbsAmount}
                    g ({barChartData2[2][1]}% of daily norm)
                  </div>
                </div>
                <div class="flex gap-4 mt-4 max-sm:flex-col">
                  <div
                    class="shrink-0 my-auto mx-auto w-12 h-2 bg-darkGreen"
                  ></div>
                  <div
                    class="flex-1 text-sm sm:text-m max-md:max-w-full max-sm:text-center"
                  >
                    <span class="font-bold">Fat</span> - {$mealInfo2.fatAmount} g
                    ({barChartData2[3][1]}% of daily norm)
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-1/3 max-lg:w-full">
              <div bind:this={pieChartContainer2}></div>
            </div>
            <div class="flex -mt-16 flex-col w-1/3 max-lg:w-full">
              <div bind:this={barChartContainer2}></div>
            </div>
          </div>
        </div>
      </div>{/if}
  </div>
</div>

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
    {#if $mealInfo1 && $mealInfo1.vitamins && $mealInfo2 && $mealInfo2.vitamins}
      <div
        class="mt-12 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:mt-10 max-md:max-w-full"
      >
        Vitamins
      </div>
      <div
        class="flex flex-row justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo1.vitamins as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo2.vitamins.find((v) => v.name === name)}
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
                        Math.max(
                          ...$mealInfo1.vitamins.map(
                            (v) => v.percentOfDailyNeeds
                          )
                        )
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
            {/if}
          {/each}
        </div>
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo2.vitamins as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo1.vitamins.find((v) => v.name === name)}
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
                        Math.max(
                          ...$mealInfo2.vitamins.map(
                            (v) => v.percentOfDailyNeeds
                          )
                        )
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
            {/if}
          {/each}
        </div>
      </div>
    {/if}
    {#if $mealInfo1 && $mealInfo1.minerals && $mealInfo2 && $mealInfo2.minerals}
      <div
        class="mt-16 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:max-w-full"
      >
        Minerals
      </div>
      <div
        class="flex flex-row justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo1.minerals as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo2.minerals.find((m) => m.name === name)}
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
                        Math.max(
                          ...$mealInfo1.minerals.map(
                            (m) => m.percentOfDailyNeeds
                          )
                        )
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
            {/if}
          {/each}
        </div>
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo2.minerals as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo1.minerals.find((m) => m.name === name)}
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
                        Math.max(
                          ...$mealInfo2.minerals.map(
                            (m) => m.percentOfDailyNeeds
                          )
                        )
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
            {/if}
          {/each}
        </div>
      </div>
    {/if}
    {#if $mealInfo1 && $mealInfo1.otherNutrients && $mealInfo2 && $mealInfo2.otherNutrients}
      <div
        class="mt-16 text-l sm:text-xl font-bold leading-10 text-center text-black max-md:max-w-full"
      >
        Other nutrients
      </div>
      <div
        class="flex flex-row justify-center mt-12 w-full max-w-[1024px] max-md:mt-10 max-md:max-w-full"
      >
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo1.otherNutrients as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo2.otherNutrients.find((o) => o.name === name)}
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
            {/if}
          {/each}
        </div>
        <div class=" w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each $mealInfo2.otherNutrients as { name, amount, unit, percentOfDailyNeeds }}
            {#if $mealInfo1.otherNutrients.find((o) => o.name === name)}
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
            {/if}
          {/each}
        </div>
      </div>
      <button
      class="mx-auto mt-16 justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
      on:click={goBack}
    >
      Go back
    </button>
    {/if}
  </div>

 
</div>

<style>
  .selected {
    background-color: rgb(17, 26, 20);
    color: white;
  }
</style>
