<script>
  
  import { onMount } from "svelte";
  import { userDataStore } from "../store.js";
  import { goto } from "$app/navigation";
  import Spinner from "svelte-spinner";
  
  
  let productInputs = []; 
  let imageLoaded = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }


  onMount(() => {
    const addProductButton = document.querySelector(".add-product-btn");
    const productsContainer = document.getElementById("productsContainer");

    addProductButton.addEventListener("click", () => {
      const inputContainer = document.createElement("div"); 
      inputContainer.classList.add("flex", "items-center", "max-md:max-w-full"); 

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter the name";
      input.classList.add(
        "h-12",
        "pl-2",
        "flex-1",
        "border",
        "border-darkGreen",
        "pr-10",
        "mb-2",
        "product-input"
      );

      
      inputContainer.appendChild(input);

      
      productsContainer.insertBefore(inputContainer, addProductButton);

      
      productInputs = [...productInputs, input];
    });
  });
  function handleSubmit(event) {
    event.preventDefault(); 

   
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const lifestyle = document.getElementById("lifestyle").value;
    const diet = document.getElementById("diet").value;
    const productsToAvoid = productInputs.map((input) => input.value);
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    
    const userData = {
      dob,
      gender,
      lifestyle,
      diet,
      productsToAvoid,
      height,
      weight,
    };

    function countCalories(userData) {
     
      const currentDate = new Date();
     
      const dob = new Date(userData.dob);
     
      let age = currentDate.getFullYear() - dob.getFullYear();
      
      if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() &&
          currentDate.getDate() < dob.getDate())
      ) {
        age--;
      }

      
      let bmr;
      if (userData.gender === "male") {
        bmr = 66 + 13.7 * userData.weight + 5 * userData.height - 6.8 * age;
      } else if (userData.gender === "female") {
        bmr = 655 + 9.6 * userData.weight + 1.8 * userData.height - 4.7 * age;
      } else {
        bmr =
          (66 +
            13.7 * userData.weight +
            5 * userData.height -
            6.8 * age +
            655 +
            9.6 * userData.weight +
            1.8 * userData.height -
            4.7 * age) /
          2;
      }

      
      let activityLevelFactor;
      switch (userData.lifestyle) {
        case "sedentary":
          activityLevelFactor = 1.2;
          break;
        case "light":
          activityLevelFactor = 1.375;
          break;
        case "average":
          activityLevelFactor = 1.55;
          break;
        case "high":
          activityLevelFactor = 1.725;
          break;
        case "very_high":
          activityLevelFactor = 1.9;
          break;
      }

    
      const totalCalories = Math.round(bmr * activityLevelFactor);

      
      return totalCalories;
    }
    userData.totalCalories = countCalories(userData);

   
    const mealPlanMessage = document.getElementById("mealPlanMessage");
    mealPlanMessage.classList.remove("hidden");

  
    const caloriesCount = document.getElementById("caloriesCount");
    caloriesCount.textContent = countCalories(userData).toString();
    localStorage.setItem("userData", JSON.stringify(userData));
    
    userDataStore.set(userData);
  }

 

 
</script>

<main class="bg-mainBeige">
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
  <div class="flex w-full max-md:flex-col max-md:items-center">
    <section
      class="w-full py-10 flex flex-col max-md:px-10 items-center"
    >
      <header class="text-center mb-6">
        <h1 class="text-xl sm:text-xxl font-bold leading-10 max-w-full">
          SET UP YOUR PROFILE HERE!
        </h1>
        <p class="mt-3 text-sm sm:text-m leading-6 max-w-[480px]">
          Our app can help manage your diet and track your progress by using
          meal planner feature. If you want to use it, we’ll need some biometric
          data from you so we can suggest you best plans based on your needs and
          wishes.
        </p>
      </header>

      <form
        class="flex flex-col gap-6 w-full md:px-20"
        on:submit={handleSubmit}
      >
        <div class="flex flex-col max-md:max-w-full">
          <label for="dob">Date of birth</label>
          <input
            id="dob"
            type="date"
            pattern="\d{2}\.\d{2}\.\d{4}"
            max="2007-12-31"
            placeholder="dd.mm.yyyy"
            class=" px-2 pr-4 h-12 border border-black border-solid max-md:max-w-full"
            required
          />
        </div>

        <div class="flex flex-col max-md:max-w-full">
          <label for="gender">Gender</label>
          <div class="select-wrapper">
            <select
              class="h-12 w-full pl-2 border border-black border-solid text-neutral-600 max-md:max-w-full"
              id="gender"
              required
            >
              <option value="" disabled selected hidden>Select one...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col max-md:max-w-full">
          <label for="lifestyle">Lifestyle</label>
          <div class="select-wrapper">
            <select
              class="h-12 w-full pl-2 border border-black border-solid text-neutral-600 max-md:max-w-full truncate max-[1360px]:pr-10"
              id="lifestyle"
              required
            >
              <option value="" disabled selected hidden>Select one...</option>
              <option value="sedentary">Sedentary</option>
              <option value="light"
                >Light activity (light exercises 1-3 days per week)</option
              >
              <option value="average"
                >Average activity (moderate exercise 3-5 days per week)</option
              >
              <option value="high"
                >High activity (intense exercises 6-7 days per week)</option
              >
              <option value="very_high"
                >Very high activity (exercise or intensive workouts 2 times a
                day)</option
              >
            </select>
          </div>
        </div>

        <div class="flex flex-col max-md:max-w-full">
          <label for="diet">Your diet</label>
          <div class="select-wrapper">
            <select
              class="h-12 w-full pl-2 border border-black border-solid text-neutral-600 max-md:max-w-full"
              id="diet"
              required
            >
              <option value="" disabled selected hidden>Select one...</option>
              <option value="">I don't follow any diet</option>
              <option value="gluten free">Gluten Free</option>
              <option value="ketogenic">Ketogenic</option>
              <option value="vegeterian">Vegeterian</option>
              <option value="lacto-vegeterian">Lacto-Vegeterian</option>
              <option value="ovo-vegeterian">Ovo-Vegeterian</option>
              <option value="vegan">Vegan</option>
              <option value="pescetarian">Pescetarian</option>
              <option value="paleo">Paleo</option>
              <option value="primal">Primal</option>
              <option value="whole30">Whole30</option>
              <option value="">Other</option>
            </select>
          </div>
        </div>

        <div class="relative flex flex-col max-w-full">
          <label for="productsContainer">Products you avoid</label>
          <div
            class="relative flex items-start flex-row"
            id="productsContainer"
          >
            <button type="button" class="add-product-btn">
              <img
                src="/plus.svg"
                alt="Adding the product icon"
                class="h-10 mr-2"
              />
            </button>
          </div>
        </div>

        <div class="flex flex-row justify-between max-md:max-w-full">
          <div class="flex flex-col w-1/3 max-md:max-w-[calc(50%-1rem)]">
            <label for="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              min="1"
              class="h-12 border pl-2 border-black border-solid max-md:max-w-full"
              required
            />
          </div>

          <div class="flex flex-col w-1/3 max-md:max-w-[calc(50%-1rem)]">
            <label for="weight">Weight (kg)</label>
            <input
              id="weight"
              type="number"
              min="1"
              class="h-12 border pl-2 border-black border-solid max-md:max-w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="self-center px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer mt-10"
          >Save</button
        >
      </form>
      <div id="mealPlanMessage" class="hidden my-6 text-center max-w-[480px]">
        <p class=" text-sm sm:text-m">
          Your daily norm of calories is <span
            class="font-semibold"
            id="caloriesCount"
          ></span>. Now you can create a personal meal plan based on your needs
          and preferences, check it out!
        </p>
        <button
          class="mt-6 px-6 py-3 text-sm sm:text-m bg-darkGreen hover:bg-mainGreen border border-darkGreen border-solid text-white cursor-pointer"
          on:click={() => goto("/meal_plan")}>Go to meal plan</button
        >
      </div>
    </section>

    <aside class="w-full max-lg:hidden overflow-hidden">
      <img
        src="/poster_profile.jpeg"
        alt="User profile setup poster"
        loading="lazy"
        class="object-cover w-full h-[1200px]"
        on:load={handleImageLoad}
      />
    </aside>
  </div>
</main>

<style>
  .select-wrapper {
    position: relative;
    display: inline-block;
  }

  .select-wrapper select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url(src/assets/icons/arrow_down.svg);
    background-position: right 16px center;
    background-repeat: no-repeat;
  }

  #productsContainer {
    display: flex;
    flex-direction: column;
  }
</style>
