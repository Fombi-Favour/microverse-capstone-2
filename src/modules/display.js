import axios from 'axios';
import { likeApi, commentApi } from './apiUrl.js';
import { getPokemonSpecies, getPokemonUrl } from './getData.js';

let cardDisplay = '';
const blur = document.getElementById('blur');
const popComment = document.getElementById('pop-comment');
const card = document.querySelector('.pokemon');
const mainComments = document.querySelector('.main-list');
const addComment = document.querySelector('.add-comment');
const Name = document.querySelector('#input-col');
const Comment = document.querySelector('#comment-text');
const closeBtn = document.querySelector('.close');
const commentDetails = document.querySelector('.poke-content');
const otherInfo = document.querySelector('.mid-poke');

// count comments
const countComments = (item) => {
  document.querySelector('#comment-count').innerHTML = `Comments (${item})`;
};

// fetch comment and display popup
const fetchComment = async (itemId) => {
  const response = await fetch(`${commentApi}?item_id=${itemId}`);
  const data = await response.json();
  const Comments = await data;
  mainComments.innerHTML = '';
  if (response.status === 200) {
    Comments.forEach((index) => {
      mainComments.innerHTML += `
          <li class="row">
            <span class="date">${index.creation_date}</span>
            <span class="name">${index.username}</span>
            <span class="desc">${index.comment}</span>
          </li>
        `;
      // count comments
      countComments(Comments.length);
    });
  } else {
    mainComments.innerHTML = '';
    document.querySelector('#comment-count').innerHTML = 'Comments (0)';
  }
};

// Comment function (post comment)
const postComment = async (itemId, username, comment) => {
  await fetch(`${commentApi}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      item_id: itemId,
      username,
      comment,
    }),
  });
  fetchComment(itemId);
};

// Send comments to the API
addComment.addEventListener('click', () => {
  const reqId = addComment.getAttribute('id');
  postComment(reqId, Name.value, Comment.value);
  Name.value = '';
  Comment.value = '';
});

// toggle behaviour
const toggle = () => {
  blur.classList.toggle('active');
  popComment.classList.toggle('active');
};

closeBtn.addEventListener('click', () => { toggle(); });

const displayPokemon = async () => {
  const pokemon = await getPokemonUrl();
  const url = await getPokemonSpecies();
  const numberLikes = JSON.parse(localStorage.getItem('likes'));
  const postLikes = Array.isArray(numberLikes) ? numberLikes : [];
  let postLikeNumber;
  // eslint-disable-next-line no-return-assign
  postLikes.forEach((like) => (parseInt(like.item_id, 10) === pokemon.id ? (postLikeNumber = like.likes) : ''));

  // desktop version of pokemon count
  const count = document.querySelector('.pokemon-count');
  count.innerHTML = `(${pokemon.length})`;

  // mobile version of pokemon count
  const counter = document.querySelector('#mobile-count');
  counter.innerHTML = `(${pokemon.length})`;

  axios.get(likeApi)
    .then((res) => localStorage.setItem('likes', JSON.stringify(res.data)));
  pokemon.forEach((data) => {
    cardDisplay += `
        <div class="pokemon-content">
            <img id="pic" src="${data.sprites.other['official-artwork'].front_default}" alt="pokemon-pic">
            <div class="content-desc">
                <h4>${data.species.name}</h4>
                <div class="likes">
                    <button type="button" class="like-me" id=${data.id}>
                      <i class="las la-heart"></i>
                    </button>
                    <span class="like-count">${postLikeNumber || '0'} Likes</span>
                </div>
            </div>
            <div class="action">
                <button type="button" class="btn-comment ${data.id}" id="${data.species.name}">Comments</button>
                <button type="button" class="btn-reserve" id="${data.species.name}">Reserve</button>
            </div>
        </div>
    `;
    card.innerHTML = cardDisplay;
  });
  const commentButton = document.querySelectorAll('.btn-comment');
  const likeButton = document.querySelectorAll('.like-count');
  const LikeHandle = () => {
    likeButton.forEach((item) => item.addEventListener('click', () => {
      likeButton.classList.add('activate');
      axios.post(likeApi, { item_id: item.id })
        .then(() => {
          setTimeout(() => {
            likeButton.classList.remove('activate');
            postLikeNumber += 1;
          }, 760);
        });
    }));
  };

  LikeHandle();

//   console.log(url);

  // Comment button for each pokemon card
  commentButton.forEach((index) => index.addEventListener('click', (e) => {
    const commentId = e.target.id;
    toggle();
    fetchComment(commentId);
    addComment.setAttribute('id', commentId);
    commentDetails.innerHTML = `
        <img src="${e.target.parentElement.parentElement.firstElementChild.src}" alt="name" id="one-pic" />
        <h2>${e.target.id}</h2>
        ${console.log(url)}
    `;
  }));
};

// eslint-disable-next-line import/prefer-default-export
export { displayPokemon };
