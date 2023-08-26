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

const getCombinedData = async () => {
  const pokemon = await getPokemonUrl();
  const pokeUrl = await getPokemonSpecies();

  const combinedData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const data1 of pokemon) {
    const data2 = pokeUrl.find((data2) => data2.id === data1.id);
    if (data2) {
      const combinedObject = { ...data1, ...data2 };
      combinedData.push(combinedObject);
    }
  }

  return combinedData;
};

// eslint-disable-next-line object-curly-newline
export { getPokemon, getPokemonUrl, getPokemonSpecies, getCombinedData };
