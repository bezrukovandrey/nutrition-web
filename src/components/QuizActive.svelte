<script>
  import { onMount } from "svelte";
  import { updateScore } from "../store.js";
  import { goto } from "$app/navigation";
  import quizData from "../quiz.json";
  import Spinner from "svelte-spinner";
  

  export let quizId;
  let selectedAnswer = null;
  let userAnswers = [];
  let showResultsButton = false;
  let quizCompleted = false; 

  let currentQuestionIndex = (quizId - 1) * 10;
  let maxQuestionIndex = currentQuestionIndex + 10;
  let questions = quizData.quizQuestions.slice(
    currentQuestionIndex,
    maxQuestionIndex
  );
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }

  function checkAnswer() {
    if (selectedAnswer !== null) {
      userAnswers.push(selectedAnswer);

      selectedAnswer = null;
      
      if (currentQuestionIndex + 1 < maxQuestionIndex) {
        currentQuestionIndex++; 
      } else {
        showResultsButton = true;
        quizCompleted = true;
      }
    } else {
      alert("Please select an answer before moving to the next question.");
    }
  }

  function showResults() {
    let correctAnswersCount = 0;

   
    questions.forEach((question) => {
     
      const correctAnswer = question.answer;

      
      const questionIndex = questions.indexOf(question);

      
      const userAnswer = userAnswers[questionIndex];

      
      if (userAnswer === correctAnswer) {
       
        correctAnswersCount++;
      }
     
    });

    
    updateScore(correctAnswersCount);
    
    goto(`/quiz/${quizId}/results`);
  }

  onMount(() => {
    
    questions = quizData.quizQuestions.slice(
      currentQuestionIndex,
      maxQuestionIndex
    );
  });
</script>

<main class="bg-mainBlue">
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
  <div class="flex w-full max-md:flex-col max-md:items-center">
    <main class="flex flex-col py-20 px-16 mx-auto w-full text-white w-1/2">
      <h1 class="w-full sm:text-l text-m text-center">
        {`QUIZ ${quizId} - QUESTION ${(currentQuestionIndex % 10) + 1}`}
      </h1>
      <section
        class="mt-8 w-full sm:text-xxl font-bitter text-xl leading-10 text-center"
      >
        {#if quizData && quizData.quizQuestions && quizData.quizQuestions[currentQuestionIndex]}
          {quizData.quizQuestions[currentQuestionIndex].question}
        {:else}
          <p>No questions available.</p>
        {/if}
      </section>
      <div
        class="flex justify-center items-center max-sm:px-0 px-16 mt-20 w-full whitespace-nowrap text-black"
      >
        <div
          class="flex flex-col max-w-full text-s gap-8 sm:text-m w-[300px] sm:w-[360px]"
        >
          {#if quizData && quizData.quizQuestions && quizData.quizQuestions[currentQuestionIndex]}
            {#each quizData.quizQuestions[currentQuestionIndex].options as option}
            <button
            class="flex items-center justify-center px-6 py-3 sm:text-m leading-8 text-sm border border-darkGreen border-solid cursor-pointer
              {quizCompleted
                ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                : selectedAnswer === option
                  ? 'bg-darkGreen text-white'
                  : 'bg-mainBeige text-darkGreen hover:bg-darkGreen hover:text-white'}"
            on:click={() => {
              if (!quizCompleted) { 
                selectedAnswer = option;
                checkAnswer();
              }
            }}
            disabled={quizCompleted}
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
        src="/poster_profile.jpeg"
        alt="Active quiz poster"
        class="object-cover w-full h-full"
        loading="lazy"
        on:load={handleImageLoad}
      />
    </aside>
  </div>
</main>
