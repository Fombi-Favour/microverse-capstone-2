import { getPokemonUrl } from './getData.js';

const displayPokemon = async () => {
  const pokemon = await getPokemonUrl();
  const card = document.querySelector('.pokemon');
  card.innerHTML = '';
  pokemon.forEach((data) => {
    const display = `
            <div class="pokemon-content">
                <img id="pic" src="${data.sprites.other['official-artwork'].front_default}" alt="pokemon-pic">
                <div class="content-desc">
                    <h4>${data.species.name}</h4>
                    <div class="likes">
                        <i class="las la-heart"></i>
                        <span class="like-count">5 Likes</span>
                    </div>
                </div>
                <div class="action">
                    <button type="button" class="btn-click">Comments</button>
                    <button type="button" class="btn-click">Reserve</button>
                </div>
            </div>
        `;
    card.innerHTML += display;
  });

  // desktop version of pokemon count
  const count = document.querySelector('.pokemon-count');
  count.innerHTML = `(${pokemon.length})`;

  // mobile version of pokemon count
  const counter = document.querySelector('#mobile-count');
  counter.innerHTML = `(${pokemon.length})`;
};

// eslint-disable-next-line import/prefer-default-export
export { displayPokemon };
