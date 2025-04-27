<script>
  import { onMount} from "svelte";
  import { goto } from "$app/navigation";

  
  let searchResults = [];
  const pageSize = 12; 
  let currentPage = 0; 

 
  $: paginatedResults = searchResults.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  
  function nextPage() {
    if ((currentPage + 1) * pageSize < searchResults.length) {
      currentPage++;
    }
  }


  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
    }
  }

  
  $: totalPages = Math.ceil(searchResults.length / pageSize);
  $: pages = Array.from({ length: totalPages }, (_, i) => i);


  function goToPage(index) {
    currentPage = index;
  }

  
  onMount(() => {
    
    function handleArrowKeys(event) {
      if (event.key === "ArrowLeft") {
        prevPage();
      } else if (event.key === "ArrowRight") {
        nextPage();
      }
    }
    window.addEventListener("keydown", handleArrowKeys);
    window.addEventListener("searchResultsUpdated", (event) => {
      const searchData = event.detail;
      console.log("here", searchData);
      searchResults = searchData.results.map((result) => ({
        id: result.id,
        title: result.title,
        image: result.image,
        imageType: result.imageType,
        name: result.name,
      }));
      
    });

  
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  });
</script>

{#if searchResults.length > 0}
  <main class="flex flex-col px-8 pb-20 bg-mainBeige">
    
    <div
      class="shrink-0 h-px bg-black border border-black border-solid w-full"
    ></div>
    <h1
      class="self-center mt-12 text-xl font-bold leading-10 text-center text-black md:max-w-full"
    >
      Search results
    </h1>

   
    <article class="my-12 flex flex-wrap gap-6 justify-center">
     
      {#each paginatedResults as result}
        <figure class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          
          <img
            src={result.image.includes("recipes")
              ? `https://img.spoonacular.com/recipes/${result.id}-636x393.${result.imageType}`
              : `https://img.spoonacular.com/ingredients_500x500/${result.image}`}
            alt={result.title}
            class="w-full aspect-square border-2 border border-darkGreen"
            on:error={(e) => e.target.src = '/placeholder-image.jpg'}
          />
          <div
            class="mt-6 text-sm sm:text-m font-semibold text-center capitalize"
          >
            {result.image.includes("recipes") ? result.title : result.name}
        </div>
         
          <button
            class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer mt-4"
            on:click={() =>
              goto(
                result.image.includes("recipes")
                  ? `/meal/${result.id}`
                  : `/product/${result.id}`
              )}
          >
            Details
          </button>
        </figure>
      {/each}
    </article>

    
    <div
      class="flex max-sm:justify-center items-center justify-between w-full px-12 bg-mainBeige pb-12 mx-auto gap-8 flex-wrap"
    >
      
      <nav class="flex gap-2 px-6 my-auto">
        {#each pages as page}
          <button
            class="shrink-0 w-2 h-2 rounded-full {page === currentPage
              ? 'bg-darkGreen'
              : 'bg-neutral-400'}"
            on:click={() => goToPage(page)}
          ></button>
        {/each}
      </nav>

     
      <div class="flex gap-4">
        
        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={currentPage === 0}
          on:click={prevPage}
        >
          <img
            src="../src/assets/arrow_left.svg"
            class="w-6 aspect-square invert"
            alt = "Previous button"
          />
        </button>

        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={(currentPage + 1) * pageSize >= searchResults.length}
          on:click={nextPage}
        >
          <img
            src="../src/assets/arrow_right.svg"
            class="w-6 aspect-square invert"
            alt="Next button"
          />
        </button>
      </div>
    </div>
  </main>
{/if}