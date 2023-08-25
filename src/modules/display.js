import axios from 'axios';
import { getPokemonSpecies, getPokemonUrl } from './getData.js';
import { likeApi } from './apiUrl.js';
import commentModals from './modals.js';

const displayPokemon = async () => {
  const pokemon = await getPokemonUrl();
  const url = await getPokemonSpecies();
  console.log(url[0].habitat.name);
  const numberLikes = JSON.parse(localStorage.getItem('likes'));
  const postLikes = Array.isArray(numberLikes) ? numberLikes : [];
  let totalLikes;
  const card = document.querySelector('.pokemon');
  card.innerHTML = '';
  // desktop version of pokemon count
  const count = document.querySelector('.pokemon-count');
  count.innerHTML = `(${pokemon.length})`;

  // mobile version of pokemon count
  const counter = document.querySelector('#mobile-count');
  counter.innerHTML = `(${pokemon.length})`;

  pokemon.forEach((data) => {
    // eslint-disable-next-line no-return-assign
    postLikes.forEach((like) => (parseInt(like.item_id, 10) === data.id ? (totalLikes = like.likes) : ''));

    axios
      .get(likeApi)
      .then((res) => localStorage.setItem('likes', JSON.stringify(res.data)));
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
                <button type="button" class="btn-comment" id="${data.species.name}">Comments</button>
                <button type="button" class="btn-reserve" id="${data.species.name}">Reserve</button>
            </div>
        </div>
    `;
    card.innerHTML += display;

    const likeButton = document.querySelectorAll('.like-me');
    const likeText = document.querySelector('.like-count');
    const liking = () => {
      likeButton.forEach((item) => item.addEventListener('click', () => {
        likeButton.classList.add('activate');
        setTimeout(() => {
          likeButton.classList.remove('activate');
        }, 760);
        axios.post(likeApi, { item_id: item.id }).then(() => {
          totalLikes += 1;
          likeText.innerHTML = totalLikes;
        });
      }));
    };
    liking();
  });

  const blur = document.getElementById('blur');
  const popComment = document.getElementById('pop-comment');

  const toggle = () => {
    blur.classList.toggle('active');
    popComment.classList.toggle('active');
  };

  const commentButton = document.querySelectorAll('.btn-comment');
  // const reserveButton = document.querySelectorAll('.btn-reserve');
  const closeButton = document.querySelector('.close');

  commentButton.forEach((item) => {
    item.addEventListener('click', async (e) => {
      await commentModals(pokemon, e.target.dataset.id);
      toggle();
    });
  });

  closeButton.addEventListener('click', () => {
    toggle();
  });
};

// eslint-disable-next-line import/prefer-default-export
export { displayPokemon };
