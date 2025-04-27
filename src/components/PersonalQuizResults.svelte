<script>
  import { onMount } from "svelte";
  import { score } from "../store";
  import { goto } from "$app/navigation";
  import Spinner from "svelte-spinner";
  

  let restartIcon;
  let currentScore = 0;
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }

  score.subscribe((value) => {
    currentScore = value;
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
  });

  function retakeQuiz() {
    goto("/personal_quiz");
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
        {#if currentScore === 1}
          YOU GOT 1 POINT. DON'T WORRY, THERE'S ALWAYS ROOM FOR IMPROVEMENT.
          KEEP LEARNING!
        {:else if currentScore >= 13 && currentScore <= 16}
          YOU GOT {currentScore} POINTS. YOUR NUTRITION KNOWLEDGE IS IMPRESSIVE!
          KEEP IT UP :)
        {:else if currentScore >= 9 && currentScore <= 12}
          YOU GOT {currentScore} POINTS. WELL DONE! YOU'RE ON THE RIGHT TRACK.
        {:else}
          YOU GOT {currentScore} POINTS. DON'T WORRY, THERE'S ALWAYS ROOM FOR IMPROVEMENT.
          KEEP LEARNING!
        {/if}
      </h1>
      <div
        class="flex flex-col mt-10 space-y-4 sm:max-w-[200px] max-sm:items-center justify-center"
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
      </div>
    </article>
  </section>
</main>
