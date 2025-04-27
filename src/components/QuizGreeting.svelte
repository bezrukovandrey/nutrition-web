<script>
  import Spinner from "svelte-spinner";
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }
</script>

<main class="flex flex-col justify-center text-white">
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
      src="/poster_quiz.png"
      alt="Quiz food poster"
      class="object-cover object-left absolute inset-0 w-full h-full"
      on:load={handleImageLoad}
    />
    <article
      class="relative flex flex-col mt-40 mx-4 mb-10 sm:ml-16 max-w-full sm:w-[360px] text-center sm:text-left"
    >
      <h1 class="text-xl sm:text-xxl font-bold font-bitter leading-10">
        TEST YOUR KNOWLEDGE.
      </h1>
      <p class="mt-6 text-sm font-opensans font-semibold leading-6">
        Challenge yourself with our interactive nutritional quiz. Answer
        questions about food, ingredients, and nutrition to test your knowledge
        and learn more about healthy eating habits.
      </p>
    </article>
  </section>
</main>
