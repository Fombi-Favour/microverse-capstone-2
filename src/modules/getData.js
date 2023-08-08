import { displayApi } from './apiUrl.js';

const getPokemon = async () => {
  const response = await fetch(displayApi);
  const data = await response.json();
  // const count = data.slice(40, 60);
  // itemCount(count.length);
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

export { getPokemon, getPokemonUrl };
