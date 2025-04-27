<script>
  import { onMount } from "svelte";
  import { favoriteMeals } from "../store.js";
  import { favoriteProducts } from "../store.js";
  import { goto } from "$app/navigation";
  import { toast } from '@zerodevx/svelte-toast'

  let searchTerm = '';
  const pageSize = 3; 
  let currentPageMeals = 0;
  let currentPageProducts = 0; 

  $: favoriteMealsData = $favoriteMeals;
  $: favoriteProductsData = $favoriteProducts;

  $: paginatedFavoriteMeals = favoriteMealsData
  .filter(meal => meal.title.toLowerCase().includes(searchTerm.toLowerCase()))
  .slice(currentPageMeals * pageSize, (currentPageMeals + 1) * pageSize);

$: paginatedFavoriteProducts = favoriteProductsData
  .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .slice(currentPageProducts * pageSize, (currentPageProducts + 1) * pageSize);

  
  function nextPageMeals() {
    if ((currentPageMeals + 1) * pageSize < favoriteMealsData.length) {
      currentPageMeals++;
    }
  }

  
  function prevPageMeals() {
    if (currentPageMeals > 0) {
      currentPageMeals--;
    }
  }

  function nextPageProducts() {
    if ((currentPageProducts + 1) * pageSize < favoriteMealsData.length) {
      currentPageProducts++;
    }
  }

  
  function prevPageProducts() {
    if (currentPageProducts > 0) {
      currentPageProducts--;
    }
  }

  
  $: totalPagesMeals = Math.ceil(favoriteMealsData.length / pageSize);
  $: pagesMeals = Array.from({ length: totalPagesMeals }, (_, i) => i);
  $: totalPagesProducts = Math.ceil(favoriteProductsData.length / pageSize);
  $: pagesProducts = Array.from({ length: totalPagesProducts }, (_, i) => i);

  
  function goToPageMeals(index) {
    currentPageMeals = index;
  }

  function goToPageProducts(index) {
    currentPageProducts = index;
  }

  function search() {
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchTerm = searchInput.value.toLowerCase().trim();
  }
  
  currentPageMeals = 0;
  currentPageProducts = 0;
}

  const removeFromFavoriteMeals = (id) => {
 
  favoriteMeals.update((meals) => {
    return meals.filter(meal => meal.id !== id);
  });

  
  toast.push('Meal is removed from favorites!', {
    theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
  });
};

const removeFromFavoriteProducts = (id) => {
  
  favoriteProducts.update((products) => {
    return products.filter(product => product.id !== id);
  });

  
  toast.push('Product is removed from favorites!', {
    theme: { '--toastBackground': '#53A5AE', '--toastColor': '#FFF' }
  });
};

  
  onMount(() => {
    console.log("favorite meals", favoriteMealsData);
    console.log("favorite products", favoriteProductsData);
    
    function handleArrowKeysMeals(event) {
      if (event.key === "ArrowLeft") {
        prevPageMeals();
      } else if (event.key === "ArrowRight") {
        nextPageMeals();
      }
    }

    function handleArrowKeysProducts(event) {
      if (event.key === "ArrowLeft") {
        prevPageProducts();
      } else if (event.key === "ArrowRight") {
        nextPageProducts();
      }
    }
    window.addEventListener("keydown", handleArrowKeysMeals);
    window.addEventListener("keydown", handleArrowKeysProducts);

    
    return () => {
      window.removeEventListener("keydown", handleArrowKeysMeals);
      window.removeEventListener("keydown", handleArrowKeysProducts);
    };
  });
</script>

<main
  class="flex flex-col justify-center px-8 sm:px-16 py-16 bg-mainBeige sm:px-4"
>
  {#if favoriteProductsData.length > 0 || favoriteMealsData.length > 0}
    <section class="sm:mr-1 sm:max-w-full">
      <div
        class="flex gap-4 flex-col sm:flex-row sm:gap-0 sm:mx-16 items-center"
      >
        <article class="flex flex-col w-full sm:w-1/2 sm:ml-0">
          <header
            class="flex flex-col grow text-black sm:max-w-full text-center sm:text-left"
          >
            <h2 class="text-l font-bold leading-10 sm:max-w-full">
              List of your favorites!
            </h2>
            <p class="sm:mr-20 mt-6 text-sm sm:text-m leading-8 sm:max-w-full">
              Here you can easily access your saved meals and products by
              searching and filtering them.
            </p>
          </header>
        </article>
        <aside class="flex flex-col w-full items-center sm:w-1/2 sm:ml-0">
          <div class="flex gap-4 self-stretch my-auto flex-wrap sm:max-w-full">
            <div
              class="relative flex items-center border min-w-[120px] bg-white border-black border-solid max-md:max-w-full flex-1"
            >
              <input
                type="text"
                class="h-12 pl-2 w-full border-none focus:ring-0"
                placeholder="Search..."
                id="searchInput"
                

              />
              
            </div>
            <button
              class="justify-center px-6 py-3 text-sm sm:text-m leading-8 bg-darkGreen border border-black border-solid text-white hover:bg-mainGreen sm:px-5"
              on:click={search}
            >
              Search
            </button>
          </div>
        </aside>
      </div>
    </section>
  {:else}
    <div class="flex flex-col px-16 bg-mainBeige max-md:px-4">
      <h1
        class="self-center py-16 text-xl sm:text-xxl font-bold leading-10 text-center text-black max-md:max-w-full"
      >
        Currently there's no favorites here. Go to search page and start
        exploring!
      </h1>
      
    </div>
    <button
      class="self-center px-6 py-3 mt-20 sm:text-m leading-8 text-sm border border-darkGreen border-solid bg-darkGreen text-white hover:bg-mainGreen cursor-pointer max-md:mt-10"
    >
        <a href="/search/meals">Search</a>
    </button>
  {/if}
  {#if paginatedFavoriteMeals.length > 0}
    
    <div
      class="shrink-0 mt-10 h-px bg-black border border-black border-solid w-full"
    ></div>
    <h1
      class="self-center mt-10 text-xl font-bold leading-10 text-center text-black md:max-w-full"
    >
      Meals
    </h1>
    <article class="my-10 flex flex-wrap gap-6 justify-center">
     
      {#each paginatedFavoriteMeals as favorite}
        <figure class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
         
          <img
            src={favorite.image}
            alt={favorite.title}
            class="w-full aspect-square border-2 border border-darkGreen"
            loading="lazy"
          />
          <div class="mt-6 text-sm sm:text-m font-semibold text-center">
            {favorite.title}
          </div>
          <!-- Кнопка "Details" -->
          <div class="flex flex-row justify-between">
          <button
            class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer mt-4"
            on:click={() => goto(`/meal/${favorite.id}`)}
          >
            Details
          </button>
          <button on:click={removeFromFavoriteMeals(favorite.id)}> 
          <img
                src="/trash.svg"
                alt="Delete icon"
                class="ml-2 w-6 sm:w-8 aspect-square mt-4 transition-opacity hover:opacity-50"
              /></button>
            </div>
        </figure>
      {/each}
    </article>

   
    <div
      class="flex items-center justify-between w-full px-12 bg-mainBeige mx-auto gap-8 flex-wrap"
    >
  
      <nav class="flex gap-2 px-6 my-auto">
        {#each pagesMeals as page}
          <button
            class="shrink-0 w-2 h-2 rounded-full {page === currentPageMeals
              ? 'bg-darkGreen'
              : 'bg-neutral-400'}"
            on:click={() => goToPageMeals(page)}
          ></button>
        {/each}
      </nav>

     
      <div class="flex gap-4">
     
        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={currentPageMeals === 0}
          on:click={prevPageMeals}
        >
          <img
            src="/arrow_left.svg"
            class="w-6 aspect-square invert"
            alt="Preious button"
          />
        </button>

      
        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={(currentPageMeals + 1) * pageSize >=
            favoriteMealsData.length}
          on:click={nextPageMeals}
        >
          <img
            src="/arrow_right.svg"
            class="w-6 aspect-square invert"
            alt="Next button"
          />
        </button>
      </div>
    </div>
  {/if}
  {#if paginatedFavoriteProducts.length > 0}
   
    <div
      class="shrink-0 mt-10 h-px bg-black border border-black border-solid w-full"
    ></div>
    <h1
      class="self-center mt-10 text-xl font-bold leading-10 text-center text-black md:max-w-full"
    >
      Products
    </h1>
    <article class="my-10 flex flex-wrap gap-6 justify-center">
     
      {#each paginatedFavoriteProducts as favorite}
        <figure class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        
          <img
            src="https://img.spoonacular.com/ingredients_500x500/{favorite.image}"
            alt={favorite.title}
            class="w-full aspect-square border-2 border border-darkGreen"
            loading="lazy"
          />
          <div
            class=" capitalize mt-6 text-sm sm:text-m font-semibold text-center"
          >
            {favorite.name}
        </div>
         
          <div class="flex flex-row justify-between">
            <button
              class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer mt-4"
              on:click={() => goto(`/product/${favorite.id}`)}
            >
              Details
            </button>
            <button on:click={removeFromFavoriteProducts(favorite.id)}>
            <img
                  src="/trash.svg"
                  alt="Delete icon"
                  class="ml-2 w-6 sm:w-8 aspect-square mt-4 transition-opacity hover:opacity-50"
                /></button>
              </div>
        </figure>
      {/each}
    </article>

   
    <div
      class="flex items-center justify-between w-full px-12 bg-mainBeige mx-auto gap-8 flex-wrap"
    >
     
      <nav class="flex gap-2 px-6 my-auto">
        {#each pagesProducts as page}
          <button
            class="shrink-0 w-2 h-2 rounded-full {page === currentPageProducts
              ? 'bg-darkGreen'
              : 'bg-neutral-400'}"
            on:click={() => goToPageProducts(page)}
          ></button>
        {/each}
      </nav>

    
      <div class="flex gap-4">
       
        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={currentPageProducts === 0}
          on:click={prevPageProducts}
        >
          <img
            src="/arrow_left.svg"
            class="w-6 aspect-square invert"
            alt="Previous button"
          />
        </button>

      
        <button
          class="flex justify-center items-center p-2 border border-black border-solid rounded-[50px] bg-darkGreen hover:bg-mainGreen"
          tabindex="0"
          disabled={(currentPageProducts + 1) * pageSize >=
            favoriteProductsData.length}
          on:click={nextPageProducts}
        >
          <img
            src="/arrow_right.svg"
            class="w-6 aspect-square invert"
            alt="Next button"
          />
        </button>
      </div>
    </div>
  {/if}
</main>
