import { displayApi } from './apiUrl.js';

// Getting data from pokemon API
const getPokemon = async () => {
  const response = await fetch(displayApi);
  const data = await response.json();
  return data;
};

const getPokemonUrl = async () => {
  const pokemon = await getPokemon();
  const urls = pokemon.results.map((pokemon) => pokemon.url);
  const fetchedUrls = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }),
  );
  return fetchedUrls;
};

const getPokemonSpecies = async () => {
  const pokemon = await getPokemonUrl();
  const urls = pokemon.map((item) => item.species.url);
  const fetchedUrl = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }),
  );
  return fetchedUrl;
};

// Getting data from involvement API

export { getPokemon, getPokemonUrl, getPokemonSpecies };
