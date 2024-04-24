<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { quizResults } from "../store.js";

  // Получаем результаты квизов из глобального состояния
  import { get } from "svelte/store";

  // Получаем результаты квизов из глобального состояния
  let results = get(quizResults);

  // Обновляем результаты при монтировании компонента
  onMount(() => {
    results = get(quizResults);
    console.log(results);
  });

  // Не забудьте отписаться от подписки при размонтировании компонента
</script>

<main class="flex flex-col justify-center px-8 sm:px-16 py-20 bg-mainBeige">
  <section class="max-w-full">
    <div class="flex gap-6 flex-col items-center sm:flex-row sm:gap-0">
      <header class="flex flex-col w-full sm:w-1/2">
        <h1
          class="text-xl sm:text-xxl font-bold leading-10 text-black max-w-full text-center sm:text-left"
        >
          Test Your Nutrition
        </h1>
      </header>
      <article class="flex flex-col w-full sm:w-1/2">
        <div class="flex flex-col grow mt-10 sm:max-w-full">
          <p
            class="text-lg leading-8 text-black max-w-full text-center sm:text-left"
          >
            Find out how well you take care of your own nutrition and generate a
            report about your eating habits now.
          </p>
          <div
            class="flex flex-col items-center sm:flex-row gap-4 sm:items-start justify-center sm:justify-start pt-4 mt-6 leading-6"
          >
            <button
              class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer"
              ><a href="/personal_quiz"> Start</a>
            </button>
            <button
              class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-mainGreen hover:text-white cursor-pointer"
            >
              Learn more
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section class="flex gap-6 mt-12 max-md:flex-col max-md:gap-0">
    <div class="flex flex-col w-1/2 max-md:ml-0 max-md:w-full">
      <img
        src="/src/assets/images/poster_quizzes.png"
        alt="Quiz poster"
        class="grow self-stretch w-full max-md:mt-10 max-md:max-w-full object-cover"
      />
    </div>
    <div class="flex flex-col ml-6 w-1/2 max-md:ml-0 max-md:w-full">
      <div
        class="flex flex-col px-6 text-xl text-black max-md:mt-10 max-md:max-w-full"
      >
        <div
          class="shrink-0 h-px bg-black border border-black border-solid max-md:max-w-full"
        ></div>
        <h2
          class="mt-14 text-xl sm:text-xxl font-bold leading-10 text-center max-md:mt-10 max-md:max-w-full"
        >
          Take quizzes
        </h2>
        <p
          class="mt-6 text-sm sm:text-m leading-8 text-center max-md:max-w-full"
        >
          Below you can find a list of quizzes about nutrition. Find out how
          well you understand the importance of a balanced diet and make
          informed choices for a healthier lifestyle.
        </p>
        <div
          class="flex justify-center items-center px-16 pt-4 mt-8 leading-1.5 max-md:px-4 max-md:mt-10 max-md:max-w-full"
        >
          <div
            class="flex flex-col mb-12 gap-8 text-sm sm:text-m items-center max-w-full w-[360px]"
          >
            {#each Array.from({ length: 4 }, (_, i) => i + 1) as quizId}
              <div class="flex flex-row gap-4">
                <button
                  class="justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
                  on:click|preventDefault={() => {
                    goto(`/quiz/${quizId}`);
                  }}
                >
                  <a href={`/quiz/${quizId}`}>Quiz {quizId}</a>
                </button>
                {#if results[quizId]}
                  <div
                    class="justify-center flex flex-row px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen cursor-default"
                  >
                    {results[quizId]}/10
                    <img
                    src="../../src/assets/icons/done.svg"
                    alt="Finished quiz"
                    class="ml-2 w-6 aspect-square"
                  />
                  </div>
                 
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
