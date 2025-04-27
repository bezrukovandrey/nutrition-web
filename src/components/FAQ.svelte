<script>
  const questions = [
    {
      id: "search-answer",
      question: "How to search recipes?",
      answer:
        "First, you need to visit the search page. To search for recipes, you can use the search bar located at the top of the screen. Simply type in keywords related to the dish or ingredients you're interested in, use filters to indicate you're looking for meals and press enter. You'll then see a list of relevant meals and by clicking one of them you'll see detailed info. Press the recipe button so you can explore further how to prepare this meal.",
    },
    {
      id: "compare-answer",
      question: "How to compare products?",
      answer:
        "Comparing products is easy! Just navigate to the products you're interested in by using the search page and add them one by one by pressing the 'Add to comparison' button. Once you've chosen two products, click on the Compare button. You'll then see a side-by-side comparison of their nutritional information.",
    },
    {
      id: "quiz-answer",
      question: "How to participate in quizzes?",
      answer:
        "Participating in quizzes is a fun way to test your knowledge! Simply go to the quizzes page and choose one. Once you've selected a quiz, read the questions carefully and select the answer you think is correct. After you've answered all the questions, submit your responses to see how you did! By the way, you can retake them if you're willing to. You also have one special quiz about your personal nutrition - check it out so you can see how well you follow healthy nutrition habits.",
    },
    {
      id: "meal-answer",
      question: "How to create a meal plan?",
      answer:
        "Creating a meal plan is a great way to stay organized and eat healthy! You can customize your meal plan based on your dietary preferences and nutritional needs by filling in the profile page form. After that you can navigate to the meal plan page and generate meal plans for a day or for a week. You'll also be able to find out some nutritional facts about generated plans to make sure they suit you.",
    },
    {
      id: "support-answer",
      question: "How to contact support?",
      answer:
        "If you have any questions or need assistance, our support team is here to help! You can contact us through the app by clicking the button below and submitting a support request. We'll do our best to address your concerns and provide you with the assistance you need.",
    },
  ];

  const toggleAnswer = (id) => {
    const answer = document.getElementById(id);
    answer.classList.toggle("hidden");
    const arrow = document.getElementById(`arrow-${id}`);
    arrow.classList.toggle("rotate");
  };
</script>

<div
  class="flex flex-col items-center px-16 py-20 text-base leading-6 bg-mainBeige text-darkGreen max-md:px-4"
>
  <h2
    class="text-xl sm:text-xxl font-bold leading-10 text-center mt-8 max-md:max-w-full"
  >
    FAQs
  </h2>

  <p class="mt-6 mb-12 text-sm text-center max-md:max-w-full">
    Find answers to common questions about the wisenourish app and its features.
  </p>

  {#each questions as { id, question, answer }}
    <hr
      class="shrink-0 max-w-full h-px bg-black border border-black border-solid w-[768px]"
    />
    <section
      class="flex gap-3 py-5 max-w-full w-[768px] max-md:flex-wrap font-semibold"
    >
      <p class="text-sm flex-1 my-auto max-md:max-w-full">
        {question}
      </p>
      <button class="arrow-btn" on:click={() => toggleAnswer(id)}>
        <img
        src="/arrow_up.svg"
        alt="Expand/Collapse"
        class="shrink-0 w-8 aspect-square rotate"
        id={`arrow-${id}`}
      />
      </button>
    </section>
    <div {id} class="hidden mb-5 w-[768px] max-w-full">
      {answer}
    </div>
  {/each}

  <hr
    class="shrink-0 max-w-full h-px bg-black border border-black border-solid w-[768px]"
  />

  <footer class="flex flex-col items-center">
    <h2
      class="mt-20 text-l font-bold leading-10 text-center max-md:mt-10 max-md:max-w-full"
    >
      Still have questions?
    </h2>
    <p class="mt-4 text-sm text-center max-md:max-w-full">
      Contact us for more information or assistance.
    </p>
    <button
      class="justify-center px-6 py-3 mt-20 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer max-md:mt-10"
    >
      Contact
    </button>
  </footer>
</div>

<style>
  .arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
  }
  .rotate {
    transform: rotate(180deg);
  }
  
</style>
