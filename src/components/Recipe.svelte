<script>
  export let onClose; 
  export let fullRecipe; 
  let [servings, readyInMinutes, ingredients, instructions] = fullRecipe;

  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

</script>

<div class="modal-overlay modal-container cursor-default" on:click={handleOverlayClick}>
  <div class="modal bg-mainBeige overflow-auto max-h-screen">
   
    <div class="flex flex-row">
      <img
        src="/clock.svg"
        alt="Duration icon"
        class="w-6 aspect-square mr-2"
      />
      <h2 class="text-m sm:text-l">Servings: {servings}</h2>
    </div>
    <div class="flex flex-row">
      <img
        src="/tableware.svg"
        alt="Servings icon"
        class="w-6 aspect-square mr-2"
      />
      <h2 class="text-m sm:text-l">Ready in {readyInMinutes} minutes</h2>
    </div>

   
    <h2 class="text-m sm:text-l">Ingredients</h2>
    <ul class="text-s font-opensans">
      {#each ingredients as ingredient}
        <li>– {ingredient}</li>
      {/each}
    </ul>

    
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
    background-color: rgba(0, 0, 0, 0.5); 
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
    overflow-y: auto; 
  }

  .modal-container {
    z-index: 1000; 
  }
</style>
