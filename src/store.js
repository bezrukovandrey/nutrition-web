
import { writable } from 'svelte/store';

function persistentStore(key, initialValue) {
  
  const storedValue = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem(key)) : null;
  
  
  const store = writable(storedValue !== null ? storedValue : initialValue);
  
  
  if (typeof window !== 'undefined') {
    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
  
  return store;
}

export const score = persistentStore('score', 0);
export const quizId = persistentStore('quizId', 1);
export const userDataStore = persistentStore('userData', {});
export const selectedMeals = persistentStore('selectedMeals', []);
export const favoriteMeals = persistentStore('favoriteMeals', []);
export const favoriteProducts = persistentStore('favoriteProducts', []);
export const quizResults = persistentStore('quizResults', {});


const initialSearchData = {
  query: '',
  intolerances: '',
  sortBy: '',
  sortDirection: 'asc',
  proteinPercentage: [0, 100],
  fatPercentage: [0, 100],
  carbsPercentage: [0, 100],
};
export const searchDataStore = persistentStore('searchData', initialSearchData);


export function updateScore(newScore) {
  score.set(newScore);
}
