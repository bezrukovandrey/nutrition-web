<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let currentPath = "";
  let searchSubMenuVisible = false;
  const switchPage = (path) => {
    currentPath = path;
    goto(path);
  };

  onMount(() => {
    currentPath = location.pathname;
  });

  // Создаем хранилище для отслеживания видимости мобильного меню
  export const mobileMenuVisible = writable(false);

  // Функция для переключения видимости мобильного меню
  const toggleMobileMenu = () => {
    mobileMenuVisible.update((value) => !value);
  };
  const toggleSearchSubMenu = () => {
    searchSubMenuVisible = !searchSubMenuVisible;
  };
</script>

<header class="custom-gradient p-4">
  <nav
    class="flex h-8 gap-6 mx-2 sm:mx-12 justify-between items-center text-white"
  >
    <a
      class="flex items-center gap-2"
      href="/"
      on:click={() => switchPage("/")}
    >
      <div class="text-l font-libreBodoni">wisenourish</div>
    </a>
    <!-- Кнопка для открытия мобильного меню -->
    <div class="lg:hidden">
      <button on:click={toggleMobileMenu}>
        <img
          src="..\..\src\assets\icons\menu.svg"
          class="hover:invert"
          alt="Menu icon"
        />
      </button>
    </div>
    <!-- Навигация для десктопа -->
    <div class="hidden lg:flex gap-6 items-center">
      <a
        href="/profile"
        class="text-m font-bitter hover:text-darkGreen {currentPath ===
        '/profile'
          ? 'border-b-2 border-white'
          : ''}"
        on:click={() => switchPage("/profile")}>profile</a
      >
      <a href="" class="relative" on:click={toggleSearchSubMenu}>
        <!-- Добавляем обработчик для открытия/закрытия подменю -->
        <span
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          ('/search/meals' || '/search/products')
            ? 'border-b-2 border-white'
            : ''}">search</span
        >
        {#if searchSubMenuVisible}
          <div
            class="absolute top-full left-0 bg-mainGreen mt-1 p-2 rounded shadow-lg z-10"
          >
            <!-- Ссылки для "Meals" и "Products" -->
            <a
              href="/search/meals"
              class=" text-m font-bitter hover:text-darkGreen py-1">meals</a
            >
            <a
              href="/search/products"
              class=" text-m font-bitter hover:text-darkGreen py-1">products</a
            >
          </div>
        {/if}
      </a>
      <a
        href="/quizzes"
        class="text-m font-bitter hover:text-darkGreen {currentPath ===
        '/quizzes'
          ? 'border-b-2 border-white'
          : ''}"
        on:click={() => switchPage("/quizzes")}>quiz</a
      >
      <a
        href="/meal_plan"
        class="text-m font-bitter hover:text-darkGreen {currentPath ===
        '/meal_plan'
          ? 'border-b-2 border-white'
          : ''}"
        on:click={() => switchPage("/meal_plan")}>meal plan</a
      >
      <a
        href="/favorites"
        class="text-m font-bitter hover:text-darkGreen {currentPath ===
        '/favorites'
          ? 'border-b-2 border-white'
          : ''}"
        on:click={() => switchPage("/favorites")}>favorites</a
      >
      <a href="/ru"
        ><img
          alt="Switch language icon"
          src="..\src\assets\icons\earth.svg"
          class="h-8 w-8 hover:invert"
        /></a
      >
    </div>
  </nav>

  <!-- Мобильное меню -->
  {#if $mobileMenuVisible}
    <div class="lg:hidden">
      <div
        class="shrink-0 h-px bg-white border border-white border-solid mt-4"
      ></div>

      <div class="flex flex-col items-center my-8 text-white gap-8">
        <a
          href="/profile"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/profile'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/profile")}>profile</a
        >
        <a
          href="/search/meals"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/search/meals'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/search/meals")}>search meals</a
        >
        <a
          href="/search/products"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/search/products'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/search/products")}>search products</a
        >
        <a
          href="/quizzes"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/quizzes'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/quizzes")}>quiz</a
        >
        <a
          href="/meal_plan"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/meal_plan'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/meal_plan")}>meal plan</a
        >
        <a
          href="/favorites"
          class="text-m font-bitter hover:text-darkGreen {currentPath ===
          '/favorites'
            ? 'border-b-2 border-white'
            : ''}"
          on:click={() => switchPage("/favorites")}>favorites</a
        >
        <a href="/ru"
          ><img
            alt="Switch language icon"
            src="..\src\assets\icons\earth.svg"
            class="h-8 w-8 hover:invert"
          /></a
        >
      </div>
    </div>
  {/if}
</header>

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
</style>
