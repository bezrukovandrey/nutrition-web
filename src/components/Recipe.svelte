<script>
  export let onClose; // Пропс для отслеживания видимости модального окна
  export let fullRecipe; // Пропс для передачи информации
  let [servings, readyInMinutes, ingredients, instructions] = fullRecipe;

  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

</script>

<div class="modal-overlay modal-container cursor-default" on:click={handleOverlayClick}>
  <div class="modal bg-mainBeige overflow-auto max-h-screen">
    <!-- Отображаем servings и readyInMinutes -->
    <div class="flex flex-row">
      <img
        src="..\src\assets\icons\clock.svg"
        alt="Duration icon"
        class="w-6 aspect-square mr-2"
      />
      <h2 class="text-m sm:text-l">Servings: {servings}</h2>
    </div>
    <div class="flex flex-row">
      <img
        src="..\src\assets\icons\tableware.svg"
        alt="Servings icon"
        class="w-6 aspect-square mr-2"
      />
      <h2 class="text-m sm:text-l">Ready in {readyInMinutes} minutes</h2>
    </div>

    <!-- Отображаем ингредиенты -->
    <h2 class="text-m sm:text-l">Ingredients</h2>
    <ul class="text-s font-opensans">
      {#each ingredients as ingredient}
        <li>– {ingredient}</li>
      {/each}
    </ul>

    <!-- Отображаем инструкции -->
    <h2 class="text-m sm:text-l">Instructions</h2>
    <ul class="text-s font-opensans">
      {@html instructions}
    </ul>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Прозрачный черный цвет */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    max-height: calc(100vh - 4rem);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    overflow-y: auto; /* Если содержимое слишком большое, добавляем прокрутку */
  }

  .modal-container {
    z-index: 1000; /* Установите значение z-index выше, чем у графиков */
    /* Добавьте другие стили для модального окна */
  }
</style>
