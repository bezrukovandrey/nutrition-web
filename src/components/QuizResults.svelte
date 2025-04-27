<script>
  import { onMount } from "svelte";
  import { score } from "../store";
  import { goto } from "$app/navigation";
  import db from "../quiz.json";
  import { quizResults } from "../store.js";
  import Spinner from "svelte-spinner";
  

  let restartIcon;
  let correctAnswersCount = 0;
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }
  
  export let quizId;

  score.subscribe((value) => {
    correctAnswersCount = value;
  });

  quizResults.update((results) => {
    return { ...results, [quizId]: correctAnswersCount };
  });

  onMount(() => {
    const quizButton = document.getElementById("quizButton");
    restartIcon = document.getElementById("restartIcon");

    quizButton.addEventListener("mouseenter", function () {
      restartIcon.style.filter = "invert(100%)";
    });

    quizButton.addEventListener("mouseleave", function () {
      restartIcon.style.filter = "none";
    });
    console.log("quiz id is", quizId);
  });
  const currentQuestionIndex = (quizId - 1) * 10;
  const maxQuestionIndex = currentQuestionIndex + 10;
  const questions = db.quizQuestions.slice(
    currentQuestionIndex,
    maxQuestionIndex
  );

  function retakeQuiz() {
    goto(`/quiz/${quizId}`);
  }
</script>

<main class="flex flex-col justify-center">
  {#if !imageLoaded}
      <div class="absolute inset-0 flex items-center justify-center bg-mainGray">
        <Spinner 
          size="50" 
          color="#F5F5DC"
          speed="1" 
          class="opacity-75"
        />
      </div>
    {/if}
  <section
    class="relative flex flex-col justify-center items-start px-16 py-20 w-full min-h-[720px] max-md:max-w-full"
  >
    <img
      src="/poster_results.png"
      alt="Quiz results poster"
      class="object-cover object-left absolute inset-0 w-full h-full"
      on:load={handleImageLoad}
    />
    <article
      class="relative flex flex-col mt-56 mx-4 mb-10 sm:ml-16 max-w-full sm:w-[360px] text-center sm:text-left"
    >
      <h1
        class="text-xl text-white sm:text-xxl font-bold font-bitter leading-10"
      >
        {#if correctAnswersCount === 1}
          YOU GOT 1 POINT. KEEP LEARNING!
        {:else if correctAnswersCount >= 8 && correctAnswersCount <= 10}
          YOU GOT {correctAnswersCount} POINTS. IMPRESSIVE! KEEP IT UP :)
        {:else if correctAnswersCount >= 6 && correctAnswersCount <= 7}
          YOU GOT {correctAnswersCount} POINTS. NOT BAD! YOU'RE ON THE RIGHT TRACK.
        {:else}
          YOU GOT {correctAnswersCount} POINTS. KEEP LEARNING!
        {/if}
      </h1>
      <div
        class="flex flex-col mt-10 space-y-4 sm:max-w-[240px] max-sm:items-center justify-center"
      >
        <button
          class="flex items-center bg-mainBeige justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
          on:click={retakeQuiz}
          id="quizButton"
        >
          Retake quiz
          <img
            src="/restart.svg"
            alt="Retake quiz"
            class="ml-2 w-6 aspect-square"
            id="restartIcon"
          />
        </button>
        <button
          class="flex items-center bg-mainBeige justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
          id="quizButton"
          ><a href="/quizzes"> Go back to quizzes </a>
        </button>
      </div>
    </article>
  </section>
  <section class="px-4 py-16 bg-mainBeige">
    <h1 class="text-xl text-center sm:text-xxl font-bold text-black mb-16">
      Questions and Answers:
    </h1>
    <ul>
      {#each questions as question, index}
        <li class="mb-16 font-opensans text-center">
          <span class="font-semibold sm:text-l text-xl"
            >Question {(currentQuestionIndex % 10) + index + 1}:
          </span>
          <span class="sm:text-l text-xl">{question.question}</span>
          <div class="flex flex-col w-[300px] sm:w-[360px] gap-8 mx-auto mt-8">
            {#each question.options as option}
              <span
                class={option === question.answer
                  ? "justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-white bg-mainGreen"
                  : "justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen"}
                >{option}</span
              >
            {/each}
          </div>
        </li>
      {/each}
    </ul>
  </section>
</main>
