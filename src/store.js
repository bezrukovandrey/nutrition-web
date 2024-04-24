import { writable } from 'svelte/store';

export const score = writable(0);

export const quizId = writable(1);

export function updateScore(newScore) {
    score.set(newScore);
}

export const userDataStore = writable({});

export const selectedMeals = writable([]);

export const searchDataStore = writable({
    query: '',
    intolerances: '',
    sortBy: '',
    sortDirection: 'asc',
    proteinPercentage: [0, 100],
    fatPercentage: [0, 100],
    carbsPercentage: [0, 100],
    
});

export const favoriteMeals = writable([]);

export const favoriteProducts = writable([]);

export const quizResults = writable({});
