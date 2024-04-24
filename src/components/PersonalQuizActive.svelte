<script>
  import { onMount } from "svelte";
  import { updateScore } from "../store.js";
  import { goto } from "$app/navigation";
  import quizData from "../quiz.json";

  let currentQuestionIndex = 0;
  let selectedAnswer = null;
  let userAnswers = [];
  let showResultsButton = false;

  function checkAnswer() {
    if (selectedAnswer !== null) {
      userAnswers.push(selectedAnswer);
      selectedAnswer = null;
      if (currentQuestionIndex < quizData.personalQuizQuestions.length - 1) {
        currentQuestionIndex++;
      } else {
        showResultsButton = true;
      }
    } else {
      alert("Please select an answer before moving to the next question.");
    }
  }

  function showResults() {
    const yesCount = userAnswers.filter((answer) => answer === "Yes").length;
    updateScore(yesCount);
    goto("/personal_quiz/results");
  }

  onMount(() => {
    console.log(quizData);
  });
</script>

<main class="bg-mainBlue">
  <div class="flex w-full max-md:flex-col max-md:items-center">
    <main class="flex flex-col py-20 px-16 mx-auto w-full text-white w-1/2">
      <h1 class="w-full sm:text-l text-m text-center">
        {`QUIZ - QUESTION ${currentQuestionIndex + 1}`}
      </h1>
      <section
        class="mt-8 w-full sm:text-xxl font-bitter text-xl leading-10 text-center"
      >
        {#if quizData && quizData.personalQuizQuestions && quizData.personalQuizQuestions[currentQuestionIndex]}
          {quizData.personalQuizQuestions[currentQuestionIndex].question}
        {:else}
          <p>No questions available.</p>
        {/if}
      </section>
      <div
        class="flex justify-center items-center px-16 mt-20 w-full whitespace-nowrap text-black"
      >
        <div class="flex flex-col max-w-full text-s gap-8 sm:text-m w-[180px]">
          {#if quizData && quizData.personalQuizQuestions && quizData.personalQuizQuestions[currentQuestionIndex]}
            {#each quizData.personalQuizQuestions[currentQuestionIndex].options as option}
              <button
                class="flex items-center bg-mainBeige justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
                on:click={() => {
                  selectedAnswer = option;
                  checkAnswer();
                }}
              >
                {option}
              </button>
            {/each}
          {:else}
            <p>No options available.</p>
          {/if}
        </div>
      </div>
      {#if showResultsButton}
        <button
          class="mt-8 w-[180px] mx-auto px-6 py-3 sm:text-m leading-8 text-sm border bg-mainBeige border-darkGreen border-solid text-darkGreen hover:bg-darkGreen hover:text-white cursor-pointer"
          on:click={showResults}
        >
          View Results
        </button>
      {/if}
    </main>

    <aside class="w-full max-lg:hidden overflow-hidden">
      <img
        src="../src/assets/images/poster_profile.jpeg"
        alt="Active quiz poster"
        class="object-cover w-full h-full"
      />
    </aside>
  </div>
</main>
