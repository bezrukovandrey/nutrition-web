

<script>
  import Spinner from "svelte-spinner";
  
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }
</script>

<main class="flex flex-col justify-center text-white">
  <section
    class="relative flex flex-col justify-center items-start px-16 py-20 w-full min-h-[720px] max-md:px-5 max-md:max-w-full"
  >
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
    <img
      src="/poster_main.webp"
      alt="Main food poster"
      class="object-cover object-left absolute inset-0 w-full h-full"
      on:load={handleImageLoad}
    />
    <article
      class="relative flex flex-col mt-56 sm:mt-64 mx-4 mb-12 sm:ml-16 max-w-full sm:w-[360px] text-center sm:text-left"
    >
      <h1 class="text-xl sm:text-xxl font-bold font-bitter leading-10">
        YOU ARE WHAT YOU EAT.
      </h1>
      <p class="mt-6 text-sm sm:text-m font-opensans leading-6">
        Discover the power of wisenourish today! wisenourish is your ultimate
        nutrition companion, providing recipes, product information, and
        personalized meal plans. Take control of your health and well-being with
        wisenourish.
      </p>
    </article>
  </section>
</main>