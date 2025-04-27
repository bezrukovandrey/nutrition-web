

<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let currentPath = "";
  let searchSubMenuVisible = false;
  let transitionInProgress = false;
  export const mobileMenuVisible = writable(false);

  async function switchPage(path) {
    if (transitionInProgress) return;
    transitionInProgress = true;
    
    
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 150ms ease-out';
    
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    currentPath = path;
    await goto(path);
    
    
    document.documentElement.style.opacity = '1';
    transitionInProgress = false;
  }

  const toggleMobileMenu = () => {
    mobileMenuVisible.update((value) => !value);
  };

  const toggleSearchSubMenu = () => {
    searchSubMenuVisible = !searchSubMenuVisible;
  };

  onMount(() => {
    currentPath = location.pathname;

    document.documentElement.style.opacity = '1';
  });
</script>

<style>
  .custom-gradient {
    background-image: linear-gradient(
      to right,
      rgb(20, 84, 69),
      rgb(34, 135, 114),
      rgb(40, 173, 147),
      rgb(47, 193, 164)
    );
  }

  
  :global(html) {
    opacity: 1;
    transition: opacity 150ms ease-out;
    min-height: 100vh;
  }

  :global(body) {
    opacity: 1 !important;
  }
</style>

<header class="custom-gradient p-4">
  <nav class="flex h-8 gap-6 mx-2 sm:mx-12 justify-between items-center text-white">
    <a class="flex items-center gap-2" href="/" on:click|preventDefault={() => switchPage("/")}>
      <div class="text-l font-libreBodoni">wisenourish</div>
    </a>
    
   
    <div class="lg:hidden">
      <button on:click={toggleMobileMenu}>
        <img src="/menu.svg" class="hover:invert" alt="Menu icon" />
      </button>
    </div>
    
    
    <div class="hidden lg:flex gap-6 items-center">
      <a href="/profile" 
         class="text-m font-bitter hover:text-darkGreen {currentPath === '/profile' ? 'border-b-2 border-white' : ''}"
         on:click|preventDefault={() => switchPage("/profile")}>profile</a>
      
      <a href="" class="relative" on:click|preventDefault={toggleSearchSubMenu}>
        <span class="text-m font-bitter hover:text-darkGreen {currentPath.startsWith('/search/') ? 'border-b-2 border-white' : ''}">search</span>
        {#if searchSubMenuVisible}
          <div class="absolute top-full left-0 bg-mainGreen mt-1 p-2 rounded shadow-lg z-10" on:mouseleave={toggleSearchSubMenu}>
            <a href="/search/meals" 
               class="text-m font-bitter hover:text-darkGreen py-1 block"
               on:click|preventDefault={() => switchPage("/search/meals")}>meals</a>
            <a href="/search/products" 
               class="text-m font-bitter hover:text-darkGreen py-1 block"
               on:click|preventDefault={() => switchPage("/search/products")}>products</a>
          </div>
        {/if}
      </a>
      
      <a href="/quizzes" 
         class="text-m font-bitter hover:text-darkGreen {currentPath === '/quizzes' ? 'border-b-2 border-white' : ''}"
         on:click|preventDefault={() => switchPage("/quizzes")}>quiz</a>
      
      <a href="/meal_plan" 
         class="text-m font-bitter hover:text-darkGreen {currentPath === '/meal_plan' ? 'border-b-2 border-white' : ''}"
         on:click|preventDefault={() => switchPage("/meal_plan")}>meal plan</a>
      
      <a href="/favorites" 
         class="text-m font-bitter hover:text-darkGreen {currentPath === '/favorites' ? 'border-b-2 border-white' : ''}"
         on:click|preventDefault={() => switchPage("/favorites")}>favorites</a>
    </div>
  </nav>

  
  {#if $mobileMenuVisible}
    <div class="lg:hidden">
      <div class="shrink-0 h-px bg-white border border-white border-solid mt-4"></div>

      <div class="flex flex-col items-center my-8 text-white gap-8">
        <a href="/profile" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/profile' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/profile")}>profile</a>
        <a href="/search/meals" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/search/meals' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/search/meals")}>search meals</a>
        <a href="/search/products" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/search/products' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/search/products")}>search products</a>
        <a href="/quizzes" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/quizzes' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/quizzes")}>quiz</a>
        <a href="/meal_plan" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/meal_plan' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/meal_plan")}>meal plan</a>
        <a href="/favorites" 
           class="text-m font-bitter hover:text-darkGreen {currentPath === '/favorites' ? 'border-b-2 border-white' : ''}"
           on:click|preventDefault={() => switchPage("/favorites")}>favorites</a>
      </div>
    </div>
  {/if}
</header>