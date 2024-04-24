<script>
  import { userDataStore } from "../store.js";
  import { baseUrl, apiKey } from "../apiConfig.js";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { toast } from '@zerodevx/svelte-toast'
  let userData;
  let mealPlanData = writable(null);

  // Получаем данные userData из стора при загрузке страницы
  onMount(() => {
    userDataStore.subscribe((value) => {
      userData = value;
      console.log(userData);
    });
  });

  async function generateMealPlan(timeFrame, exclude, targetCalories, diet) {
    

    const url = `${baseUrl}/mealplanner/generate?timeFrame=${timeFrame}&exclude=${exclude}&targetCalories=${targetCalories}&diet=${diet}&apiKey=${apiKey}`;

    try {
     
      const response = await fetch(url);
      const data = await response.json();
     
      mealPlanData.set(data);
      toast.push('Meal plan was successfully generated for you!', {
      theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
    });
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>

<main class="flex flex-col justify-center text-white">
  <section
    class="relative flex flex-col justify-center items-start px-16 py-20 w-full min-h-[720px] max-md:max-w-full"
  >
    <img
      src="src\assets\images\poster_meal.png"
      alt="Meal planner poster"
      class="object-cover object-left absolute inset-0 w-full h-full"
    />
    <article
      class="relative flex flex-col mx-4 mb-10 gap-10 sm:ml-16 max-w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center sm:text-left"
    >
      <h1 class="text-xl sm:text-xxl font-bold font-bitter leading-10">
        IT’S TIME TO TAKE CARE OF YOUR NUTRITION.
      </h1>
      <p class=" text-sm font-opensans leading-6">
        Save time, eat healthier, and reduce food waste with our meal planning
        feature. Plan meals for a day or a week, and enjoy the benefits of
        organized and nutritious eating.
      </p>
      <nav
        class="flex flex-col sm:max-w-[200px] gap-4 max-sm:items-center justify-between text-sm sm:text-m text-black"
      >
        <button
          class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border bg-mainBeige border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
          on:click={() =>
            generateMealPlan(
              "day",
              userData.productsToAvoid.join(","),
              userData.totalCalories,
              userData.diet
            )}
        >
          Plan for a day
        </button>
        <button
          class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border bg-mainBeige border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
          on:click={() =>
            generateMealPlan(
              "week",
              userData.productsToAvoid.join(","),
              userData.totalCalories,
              userData.diet
            )}
        >
          Plan for a week
        </button>
      </nav>
    </article>
  </section>
</main>
{#if $mealPlanData && $mealPlanData.meals}
  <main class="flex flex-col px-16 py-16 bg-mainBeige max-md:px-4">
    <h1
      class="self-center text-xl sm:text-xxl font-bold leading-10 text-center text-black max-md:max-w-full"
    >
      Your personal meal plan for a day
    </h1>
    <section class="flex justify-between gap-6 mt-8 max-sm:flex-col">
      {#each $mealPlanData.meals as meal}
        <article class="flex flex-col w-full sm:w-1/3">
          <div
            class="flex flex-col sm:flex-row gap-12 justify-center items-center mt-12 max-md:px-4"
          >
            <div class="flex flex-col items-center gap-6">
              <img
                src="https://img.spoonacular.com/recipes/{meal.id}-636x393.{meal.imageType}"
                alt={meal.title}
                class="w-full aspect-square"
              />
              <h3
                class="text-m h-16 sm:text-l font-semibold text-center line-clamp-2"
              >
                {meal.title}
              </h3>
              <div
                class="shrink-0 h-px bg-black border border-black border-solid w-full"
              ></div>
              <span class=" flex flex-row"
                ><img
                  src="src\assets\icons\clock.svg"
                  alt="Duration icon"
                  class="w-6 aspect-square mr-2"
                />
                <h3 class="text-sm sm:text-m font-semibold text-center">
                  Ready in {meal.readyInMinutes} minutes
                </h3></span
              >
              <span class="flex flex-row"
                ><img
                  src="src\assets\icons\tableware.svg"
                  alt="Servings icon"
                  class="w-6 aspect-square mr-2"
                />
                <h3 class="text-sm sm:text-m font-semibold text-center">
                  Servings: {meal.servings}
                </h3></span
              >
              <button
                class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer"
              >
                <a href="meal/{meal.id}">Details</a>
              </button>
            </div>
          </div>
        </article>
      {/each}
    </section>
  </main>

  <div
    class="flex flex-col font-bitter justify-center px-16 pb-16 bg-mainBeige max-md:px-4"
  >
    <div
      class="shrink-0 h-px bg-black border border-black border-solid max-md:max-w-full"
    ></div>
    <div class="mt-10 max-md:max-w-full">
      <div class="flex gap-6 max-md:flex-col max-md:gap-0">
        <div class="flex flex-col w-1/2 max-md:ml-0 max-md:w-full">
          <div
            class="flex flex-col self-stretch my-auto text-black max-md:max-w-full"
          >
            <div class="text-l sm:text-xl leading-10 max-md:max-w-full">
              Key Nutritional Facts
            </div>
            <div class="mt-6 text-sm leading-8 max-md:max-w-full">
              Learn about the nutritional benefits of meal plan we generated for
              you.
            </div>
          </div>
        </div>
        <div
          class="flex flex-col ml-6 w-1/2 max-md:ml-0 max-md:mt-10 max-md:w-full"
        >
          <div class="flex flex-col grow max-md:max-w-full">
            <div
              class="flex gap-6 font-bold max-md:flex-wrap max-md:max-w-full"
            >
              <div
                class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
              >
                <div class="text-xl sm:text-xxl leading-10 text-black">
                  {Math.round($mealPlanData.nutrients.calories)}
                </div>
                <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                  Calories
                </div>
              </div>
              <div
                class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
              >
                <div class="text-xl sm:text-xxl leading-10 text-black">
                  {Math.round($mealPlanData.nutrients.protein)} g
                </div>
                <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                  Protein
                </div>
              </div>
            </div>
            <div class="mt-12 max-md:mt-10 max-md:max-w-full">
              <div class="flex gap-6 md:gap-0">
                <div class="flex flex-col w-1/2 max-md:ml-0 max-md:w-full">
                  <div
                    class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black max-md:mt-8"
                  >
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {Math.round($mealPlanData.nutrients.fat)} g
                    </div>
                    <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                      Fat
                    </div>
                  </div>
                </div>
                <div class="flex flex-col w-1/2 ml-6 max-md:ml-0 max-md:w-full">
                  <div
                    class="flex flex-col flex-1 items-start pl-8 font-bold border-l-2 border-solid border-l-black max-md:mt-8"
                  >
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {Math.round($mealPlanData.nutrients.carbohydrates)} g
                    </div>
                    <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                      Carbohydrates
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="mx-auto mt-16 justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
      on:click={() =>
        generateMealPlan(
          "day",
          userData.productsToAvoid.join(","),
          userData.totalCalories,
          userData.diet
        )}
    >
      Regenerate
    </button>
  </div>
{:else if $mealPlanData && $mealPlanData.week}
  <main class="flex flex-col px-16 py-16 bg-mainBeige max-md:px-4">
    <h1
      class="self-center text-xl sm:text-xxl font-bold leading-10 text-center text-black max-md:max-w-full"
    >
      Your personal meal plan for a week
    </h1>
    {#each Object.keys($mealPlanData.week) as day}
      <section class="flex justify-between gap-6 mt-16 flex-col">
        <div
          class="shrink-0 h-px bg-black border border-black border-solid w-full"
        ></div>
        <h3 class="text-l sm:text-xl font-semibold text-center capitalize">
          {day}
        </h3>
        <div
          class="shrink-0 h-px bg-black border border-black border-solid w-full"
        ></div>
        <div class="flex flex-col md:flex-row justify-center gap-4">
          {#each $mealPlanData.week[day].meals as meal}
            <article class="flex flex-col w-full sm:w-1/3">
              <div
                class="flex flex-col sm:flex-row gap-12 justify-center items-center max-md:px-4"
              >
                <div class="flex flex-col items-center gap-6">
                  <img
                    loading="lazy"
                    src="https://img.spoonacular.com/recipes/{meal.id}-636x393.{meal.imageType}"
                    alt={meal.title}
                    class="w-full aspect-square"
                  />
                  <h3
                    class="text-m h-16 sm:text-l font-semibold text-center line-clamp-2"
                  >
                    {meal.title}
                  </h3>
                  <div
                    class="shrink-0 h-px bg-black border border-black border-solid w-full"
                  ></div>
                  <span class=" flex flex-row"
                    ><img
                      src="src\assets\icons\clock.svg"
                      alt="Duration icon"
                      class="w-6 aspect-square mr-2"
                    />
                    <h3 class="text-sm sm:text-m font-semibold text-center">
                      Ready in {meal.readyInMinutes} minutes
                    </h3></span
                  >
                  <span class="flex flex-row"
                    ><img
                      src="src\assets\icons\tableware.svg"
                      alt="Servings icon"
                      class="w-6 aspect-square mr-2"
                    />
                    <h3 class="text-sm sm:text-m font-semibold text-center">
                      Servings: {meal.servings}
                    </h3></span
                  >
                  <button
                    class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer"
                  >
                    <a href={meal.sourceUrl}>Details</a>
                  </button>
                </div>
              </div>
            </article>
          {/each}
        </div>
      </section>
      <!-- Добавляем ключевые пищевые факты для каждого дня -->
      <div
        class="flex flex-col font-bitter mt-16 justify-center px-16 bg-mainBeige max-md:px-4"
      >
        <div
          class="shrink-0 h-px bg-black border border-black border-solid max-md:max-w-full"
        ></div>
        <div class="mt-10 max-md:max-w-full">
          <div class="flex gap-6 max-md:flex-col max-md:gap-0">
            <div class="flex flex-col w-1/2 max-md:ml-0 max-md:w-full">
              <div
                class="flex flex-col self-stretch my-auto text-black max-md:max-w-full"
              >
                <div class="text-l sm:text-xl leading-10 max-md:max-w-full">
                  Key Nutritional Facts
                </div>
                <div class="mt-6 text-sm leading-8 max-md:max-w-full">
                  Learn about the nutritional benefits of meal plan we generated
                  for you.
                </div>
              </div>
            </div>
            <div class="flex flex-col ml-6 w-1/2 max-md:ml-0 max-md:w-full">
              <div class="flex flex-col grow max-md:mt-10 max-md:max-w-full">
                <div
                  class="flex gap-6 font-bold max-md:flex-wrap max-md:max-w-full"
                >
                  <div
                    class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
                  >
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {Math.round($mealPlanData.week[day].nutrients.calories)}
                    </div>
                    <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                      Calories
                    </div>
                  </div>
                  <div
                    class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black"
                  >
                    <div class="text-xl sm:text-xxl leading-10 text-black">
                      {Math.round($mealPlanData.week[day].nutrients.protein)} g
                    </div>
                    <div class="mt-2 text-sm sm:text-m leading-8 text-black">
                      Protein
                    </div>
                  </div>
                </div>
                <div class="mt-12 max-md:mt-10 max-md:max-w-full">
                  <div class="flex gap-6 md:gap-0">
                    <div class="flex flex-col w-1/2 max-md:ml-0 max-md:w-full">
                      <div
                        class="flex flex-col flex-1 items-start pl-8 border-l-2 border-solid border-l-black max-md:mt-8"
                      >
                        <div class="text-xl sm:text-xxl leading-10 text-black">
                          {Math.round($mealPlanData.week[day].nutrients.fat)} g
                        </div>
                        <div
                          class="mt-2 text-sm sm:text-m leading-8 text-black"
                        >
                          Fat
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex flex-col w-1/2 ml-6 max-md:ml-0 max-md:w-full"
                    >
                      <div
                        class="flex flex-col flex-1 items-start pl-8 font-bold border-l-2 border-solid border-l-black max-md:mt-8"
                      >
                        <div class="text-xl sm:text-xxl leading-10 text-black">
                          {Math.round(
                            $mealPlanData.week[day].nutrients.carbohydrates
                          )} g
                        </div>
                        <div
                          class="mt-2 text-sm sm:text-m leading-8 text-black"
                        >
                          Carbohydrates
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
    <button
      class="mx-auto mt-16 justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
      on:click={() =>
        generateMealPlan(
          "week",
          userData.productsToAvoid.join(","),
          userData.totalCalories,
          userData.diet
        )}
    >
      Regenerate
    </button>
  </main>
{:else}
  <main class="flex flex-col px-16 py-16 bg-mainBeige max-md:px-4">
    <h1
      class="self-center text-xl sm:text-xxl font-bold leading-10 text-center text-black max-md:max-w-full"
    >
      Currently the meal plan is not available. Fill in your profile information
      and try again.
    </h1>
    <button
      class="mx-auto mt-16 justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
      ><a href="/profile"> Go back</a>
    </button>
  </main>
{/if}
