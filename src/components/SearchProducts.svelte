<script>
  import { onMount } from "svelte";
  import noUiSlider from "nouislider";
  import "nouislider/dist/nouislider.css";
  import { baseUrl, apiKey } from "../apiConfig.js";
  import { writable } from "svelte/store";

  let searchResultsData = writable(null);

  let showModal = false;
  let proteinRangeSlider;
  let fatRangeSlider;
  let carbsRangeSlider;
  let searchData = {
    query: "",
    intolerances: "",
    sortBy: "",
    sortDirection: "asc",
    proteinPercentage: [0, 100],
    fatPercentage: [0, 100],
    carbsPercentage: [0, 100],
  };

  function toggleModal() {
    showModal = !showModal;
  }

  function toggleSortDirection() {
    searchData.sortDirection =
      searchData.sortDirection === "asc" ? "desc" : "asc";
  }
  onMount(() => {
    proteinRangeSlider = document.getElementById("proteinRange");
    fatRangeSlider = document.getElementById("fatRange");
    carbsRangeSlider = document.getElementById("carbsRange");

    initializeSlider(proteinRangeSlider, "proteinPercentage");
    initializeSlider(fatRangeSlider, "fatPercentage");
    initializeSlider(carbsRangeSlider, "carbsPercentage");
  });

  function initializeSlider(sliderElement, property) {
    noUiSlider.create(sliderElement, {
      start: [0, 100],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      tooltips: {
        to: function (value) {
          return Math.round(value);
        },
      },
    });

    sliderElement.noUiSlider.on("update", function (values, handle) {
      searchData[property] = values.map(parseFloat);
    });
  }

  async function generateSearchResults(
    query,
    minProteinPercent,
    maxProteinPercent,
    minFatPercent,
    maxFatPercent,
    minCarbsPercent,
    maxCarbsPercent,
    intolerances,
    sort,
    sortDirection
  ) {
    // Формируем URL для запроса
    const intolerancesString =
      intolerances.length > 0 ? intolerances.join(",") : "";

    const url = `${baseUrl}/food/ingredients/search?number=100&query=${query}&minProteinPercent=${minProteinPercent}&maxProteinPercent=${maxProteinPercent}&minFatPercent=${minFatPercent}&maxFatPercent=${maxFatPercent}&minCarbsPercent=${minCarbsPercent}&maxCarbsPercent=${maxCarbsPercent}&intolerances=${intolerancesString}&sort=${sort}&sortDirection=${sortDirection}&apiKey=${apiKey}`;

    try {
      // Выполняем запрос
      const response = await fetch(url);
      const data = await response.json();
      // Обрабатываем полученные данные
      searchResultsData.set(data);
      const event = new CustomEvent("searchResultsUpdated", { detail: data });
      window.dispatchEvent(event);
      console.log(data); // Выводим данные в консоль (можете изменить на свою обработку)
      console.log("url:", url);
      if (data.results.length === 0) {
        alert(
          "Unfortunately, the product was not found. Try different name or parameters!"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to search products");
    }
  }
</script>

<main
  class="flex flex-col justify-center px-8 sm:px-16 py-16 bg-mainBeige sm:px-4"
>
  <section class="sm:max-w-full">
    <div
      class="flex gap-4 flex-col sm:flex-row sm:gap-0 sm:mx-16 items-center relative"
    >
      <!-- Добавлен класс "relative" -->
      <article class="flex flex-col w-full sm:w-1/2 sm:ml-0">
        <header
          class="flex flex-col grow text-black sm:max-w-full text-center sm:text-left"
        >
          <h2 class="text-l font-bold leading-8 sm:max-w-full">
            Search for foods here!
          </h2>
          <p class="sm:mr-20 mt-6 text-sm sm:text-m leading-8 sm:max-w-full">
            Find a wide variety of whole foods and ingredients to suit your
            nutritional needs. Search, filter, and sort the results to find the
            perfect option for you.
          </p>
        </header>
      </article>
      <aside class="flex flex-col w-full items-center sm:w-1/2 sm:ml-0">
        <div class="flex gap-4 self-stretch my-auto flex-wrap sm:max-w-full">
          <div
            class="relative flex items-center border min-w-[120px] bg-white border-black border-solid max-md:max-w-full flex-1"
          >
            <input
              type="text"
              class="h-12 pl-2 w-full border-none focus:ring-0"
              placeholder="Search..."
              bind:value={searchData.query}
            />
            <button
              class="absolute right-0 flex items-center bg-transparent"
              on:click={toggleModal}
            >
              <img
                src="../src/assets/icons/filter.svg"
                alt="Filter icon"
                class="w-6 h-6 mr-4"
              />
            </button>
            <div
              class="modal"
              style={showModal ? "display: block" : "display: none"}
            >
              <!-- Изменено стилирование для модального окна -->
              <div
                class="modal-content absolute left-0 top-full w-full bg-white text-darkGreen px-4 py-4 border min-w-[120px] border-black border-solid font-opensans text-xs sm:text-s"
              >
                <div class="mb-4">
                  <label for="intolerances">Intolerances:</label>
                  <select
                    id="intolerances"
                    bind:value={searchData.intolerances}
                    multiple
                  >
                    <option value="" disabled selected hidden
                      >Select one...</option
                    >
                    <option value=""></option>
                    <option value="dairy">Dairy</option>
                    <option value="gluten">Gluten</option>
                    <option value="egg">Egg</option>
                    <option value="grain">Grain</option>
                    <option value="peanut">Peanut</option>
                    <option value="seafood">Seafood</option>
                    <option value="sesame">Sesame</option>
                    <option value="shellfish">Shellfish</option>
                    <option value="soy">Soy</option>
                    <option value="sulfite">Sulfite</option>
                    <option value="tree nut">Tree Nut</option>
                    <option value="wheat">Wheat</option>
                  </select>
                </div>
                <div class="mb-4 flex flex-row items-center gap-2">
                  <label for="sort">Sort by:</label>
                  <select id="sort" bind:value={searchData.sortBy}>
                    <option value="" disabled selected hidden
                      >Select one...</option
                    >
                    <option value=""></option>

                    <option value="calories">Calories</option>

                    <option value="protein">Protein</option>

                    <option value="carbs">Carbs</option>
                  </select>
                  <button
                    class="sort-button flex flex-row"
                    on:click={toggleSortDirection}
                  >
                    <img
                      src="../src/assets/icons/sort_up.svg"
                      alt="Increasing sort icon"
                      class:active-arrow={searchData.sortDirection === "asc"}
                    />
                    <img
                      src="../src/assets/icons/sort_down.svg"
                      alt="Decreasing sort icon"
                      class:active-arrow={searchData.sortDirection === "desc"}
                    />
                  </button>
                </div>
                <div class="mb-4">Protein percentage</div>
                <div id="proteinRange" class="mb-4 mx-4 mt-12"></div>
                <div class="mb-4">Fat percentage</div>
                <div id="fatRange" class="mb-4 mx-4 mt-12">
                  <!-- Добавьте сюда ползунок для белка -->
                </div>
                <div class="mb-4">Carbs percentage</div>
                <div id="carbsRange" class="mb-4 mx-4 mt-12">
                  <!-- Добавьте сюда ползунок для белка -->
                </div>
              </div>
            </div>
          </div>

          <button
            class="justify-center px-6 py-3 text-sm sm:text-m leading-8 bg-darkGreen border border-black border-solid text-white hover:bg-mainGreen sm:px-5"
            on:click={() =>
              generateSearchResults(
                searchData.query,
                searchData.proteinPercentage[0],
                searchData.proteinPercentage[1],
                searchData.fatPercentage[0],
                searchData.fatPercentage[1],
                searchData.carbsPercentage[0],
                searchData.carbsPercentage[1],
                searchData.intolerances,
                searchData.sortBy,
                searchData.sortDirection
              )}
          >
            Search
          </button>
        </div>
      </aside>
    </div>
  </section>
</main>

<style>
  .active-arrow {
    border: 2px solid black; /* Черная рамка для активной стрелки */
  }
</style>
