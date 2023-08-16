import axios from 'axios';
import { getPokemonUrl } from './getData.js';
import { likeApi } from './apiUrl.js';

const displayPokemon = async () => {
  const pokemon = await getPokemonUrl();
  const numberLikes = JSON.parse(localStorage.getItem('likes'));
  const postLikes = Array.isArray(numberLikes) ? numberLikes : [];
  let totalLikes;
  const card = document.querySelector('.pokemon');
  card.innerHTML = '';
  pokemon.forEach((data) => {
    // eslint-disable-next-line no-return-assign
    postLikes.forEach((like) => (parseInt(like.item_id, 10) === data.id ? (totalLikes = like.likes) : ''));

    axios.get(likeApi).then((res) => localStorage.setItem('likes', JSON.stringify(res.data)));
    const display = `
            <div class="pokemon-content">
                <img id="pic" src="${data.sprites.other['official-artwork'].front_default}" alt="pokemon-pic">
                <div class="content-desc">
                    <h4>${data.species.name}</h4>
                    <div class="likes">
                        <button type="button" class="like-me" id=${data.id}>
                          <i class="las la-heart"></i>
                        </button>
                        <span class="like-count">${totalLikes || '0'} Likes</span>
                    </div>
                </div>
                <div class="action">
                    <button type="button" class="btn-click">Comments</button>
                    <button type="button" class="btn-click">Reserve</button>
                </div>
            </div>
        `;
    card.innerHTML += display;

    const likeButton = document.querySelectorAll('.like-me');
    const liking = () => {
      likeButton.forEach((item) => item.addEventListener('click', () => {
        document.getElementById(item.id).innerHTML = '&#10084;';
        axios.post(likeApi, { item_id: item.id });
      }));
    };
    liking();
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
