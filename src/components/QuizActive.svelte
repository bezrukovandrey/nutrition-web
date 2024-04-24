<script>
  import { onMount } from "svelte";
  import { score, updateScore } from "../store.js";
  import { goto } from "$app/navigation";
  import quizData from "../quiz.json";

  export let quizId;
  let selectedAnswer = null;
  let userAnswers = [];
  let showResultsButton = false;

  let currentQuestionIndex = (quizId - 1) * 10;
  let maxQuestionIndex = currentQuestionIndex + 10;
  let questions = quizData.quizQuestions.slice(
    currentQuestionIndex,
    maxQuestionIndex
  );

  function checkAnswer() {
    if (selectedAnswer !== null) {
      userAnswers.push(selectedAnswer);

      selectedAnswer = null;
      // Проверяем, что есть еще вопросы для текущего quizId
      if (currentQuestionIndex + 1 < maxQuestionIndex) {
        currentQuestionIndex++; // Переходим к следующему вопросу
      } else {
        showResultsButton = true;
      }
    } else {
      alert("Please select an answer before moving to the next question.");
    }
  }

  function showResults() {
    let correctAnswersCount = 0;

    // Проходим по каждому вопросу в структуре JSON
    questions.forEach((question) => {
      // Получаем правильный ответ для текущего вопроса
      const correctAnswer = question.answer;

      // Получаем индекс текущего вопроса в массиве userAnswers
      const questionIndex = questions.indexOf(question);

      // Получаем выбранный пользователем ответ для текущего вопроса
      const userAnswer = userAnswers[questionIndex];

      // Сравниваем выбранный пользователем ответ с правильным ответом
      if (userAnswer === correctAnswer) {
        // Если ответы совпадают, увеличиваем счетчик правильных ответов
        correctAnswersCount++;
      }
      console.log(correctAnswersCount);
    });

    // Обновляем счет пользователя с количеством правильных ответов
    updateScore(correctAnswersCount);
    console.log(correctAnswersCount);
    // Переходим на страницу с результатами
    goto(`/quiz/${quizId}/results`);
  }

  onMount(() => {
    // Инициализируем список вопросов при загрузке компонента
    questions = quizData.quizQuestions.slice(
      currentQuestionIndex,
      maxQuestionIndex
    );
  });
</script>

<main class="bg-mainBlue">
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
