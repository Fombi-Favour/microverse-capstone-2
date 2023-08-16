import { getLikes, getPokemonUrl, postLikes } from './getData.js';

const displayPokemon = async () => {
  const pokemon = await getPokemonUrl();
  const likes = await getLikes();
  const card = document.querySelector('.pokemon');
  card.innerHTML = '';
  pokemon.forEach((data, index) => {
    const likeId = likes.findIndex((like) => Number(like.item_id) === index);
    let totalLikes;
    if (likeId >= 0) {
      totalLikes = likes[likeId].likes;
    } else {
      totalLikes = 0;
    }
    const display = `
            <div class="pokemon-content">
                <img id="pic" src="${data.sprites.other['official-artwork'].front_default}" alt="pokemon-pic">
                <div class="content-desc">
                    <h4>${data.species.name}</h4>
                    <div class="likes">
                        <i class="las la-heart" id="like-me"></i>
                        <span class="like-count">${totalLikes} Likes</span>
                    </div>
                </div>
                <div class="action">
                    <button type="button" class="btn-click">Comments</button>
                    <button type="button" class="btn-click">Reserve</button>
                </div>
            </div>
        `;
    card.innerHTML += display;

    // Event listener for like button
    const likeMe = document.querySelector('#like-me');
    likeMe.addEventListener('click', async (e) => {
      likeMe.classList.add('activate');
      setTimeout(() => {
        likeMe.classList.remove('activate');
      }, 760);
      await postLikes(e.target.dataset.id);
      totalLikes += 1;
      likeMe.textContent = totalLikes;
    });
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
