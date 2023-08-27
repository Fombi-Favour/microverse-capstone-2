import axios from 'axios';
import { likeApi, commentApi, reserveApi } from './apiUrl.js';
import { getCombinedData } from './getData.js';

let cardDisplay = '';
const blur = document.getElementById('blur');
const popComment = document.getElementById('pop-comment');
const popReserved = document.getElementById('pop-reserve');
const card = document.querySelector('.pokemon');
const mainComments = document.querySelector('.main-list');
const mainReserve = document.querySelector('.main-list-reserve');
const addComment = document.querySelector('.add-comment');
const addReserve = document.querySelector('.add-reserve');
const Name = document.querySelector('#input-col');
const Comment = document.querySelector('#comment-text');
const startDate = document.querySelector('#start');
const endDate = document.querySelector('#end');
const closeBtn = document.querySelector('.close');
const close1Btn = document.querySelector('.close1');
const commentDetails = document.querySelector('.poke-content');
const reserveDetails = document.querySelector('.reserve-content');

// count comments
const countComments = (item) => {
  document.querySelector('#comment-count').innerHTML = `Comments (${item})`;
};
// count comments
const countReservations = (item) => {
  document.querySelector('#reserve-count').innerHTML = `Reservations (${item})`;
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
    mainComments.innerHTML = 'no comments...';
    mainComments.style.textAlign = 'center';
    document.querySelector('#comment-count').innerHTML = 'Comments (0)';
  }
};

// fetch reservation and display popup
const fetchReservation = async (itemId) => {
  const response = await fetch(`${reserveApi}?item_id=${itemId}`);
  const data = await response.json();
  const Reserved = await data;
  mainReserve.innerHTML = '';
  if (response.status === 200) {
    Reserved.forEach((index) => {
      mainReserve.innerHTML += `
          <li class="row">
            <span class="date">${index.date_start}-${index.date_end}</span>
            <span>by</span>
            <span class="name">${index.username}</span>
          </li>
        `;
      // count reservations
      countReservations(Reserved.length);
    });
  } else {
    mainReserve.innerHTML = 'no reservations...';
    mainReserve.style.textAlign = 'center';
    document.querySelector('#reserve-count').innerHTML = 'Reservations (0)';
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

// Reservation function (post reservation)
const postReservation = async (itemId, username, startDate, endDate) => {
  await fetch(`${reserveApi}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      item_id: itemId,
      username,
      date_start: startDate,
      date_end: endDate,
    }),
  });
  fetchReservation(itemId);
};

// Send comments to the API
addComment.addEventListener('click', () => {
  const reqId = addComment.getAttribute('id');
  postComment(reqId, Name.value, Comment.value);
  Name.value = '';
  Comment.value = '';
});

// Send reservation to the API
addReserve.addEventListener('click', () => {
  const reqId = addReserve.getAttribute('id');
  postReservation(reqId, Name.value, startDate.value, endDate.value);
  Name.value = '';
  startDate.value = '';
  endDate.value = '';
});

// toggle behaviour
const CommentToggle = () => {
  blur.classList.toggle('active');
  popComment.classList.toggle('active');
};

const ReserveToggle = () => {
  blur.classList.toggle('active');
  popReserved.classList.toggle('active');
};

closeBtn.addEventListener('click', () => { CommentToggle(); });
close1Btn.addEventListener('click', () => { ReserveToggle(); });

const displayPokemon = async () => {
  const pokemon = await getCombinedData();
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
          <img class="pic" id="${data.flavor_text_entries[6].flavor_text}" src="${data.sprites.other['official-artwork'].front_default}" alt="${data.habitat.name}">
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
              <button type="button" class="btn-comment" id="${data.species.name}">Comments</button>
              <button type="button" class="btn-reserve" id="${data.species.name}">Reserve</button>
          </div>
        </div>
    `;
    card.innerHTML = cardDisplay;
  });
  const commentButton = document.querySelectorAll('.btn-comment');
  const reserveButton = document.querySelectorAll('.btn-reserve');
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

  // Comment button for each pokemon card
  commentButton.forEach((index) => index.addEventListener('click', (e) => {
    const commentId = e.target.id;
    CommentToggle();
    fetchComment(commentId);
    addComment.setAttribute('id', commentId);
    commentDetails.innerHTML = `
        <img src="${e.target.parentElement.parentElement.firstElementChild.src}" alt="name" id="one-pic" />
        <h2>${e.target.id}</h2>
        <div class="mid-poke">
          <span><strong><em>Ability</em></strong>: <em>${e.target.parentElement.parentElement.firstElementChild.id}</em></span>
          <span><strong><em>Habitat</em></strong>: <em>${e.target.parentElement.parentElement.firstElementChild.alt}</em></span>
        </div>
    `;
  }));
  // Reservation button for each pokemon card
  reserveButton.forEach((index) => index.addEventListener('click', (e) => {
    const reserveId = e.target.id;
    ReserveToggle();
    fetchReservation(reserveId);
    addReserve.setAttribute('id', reserveId);
    reserveDetails.innerHTML = `
        <img src="${e.target.parentElement.parentElement.firstElementChild.src}" alt="name" id="rev-pic" />
        <h2>${e.target.id}</h2>
        <div class="rev-poke">
          <span><strong><em>Ability</em></strong>: <em>${e.target.parentElement.parentElement.firstElementChild.id}</em></span>
          <span><strong><em>Habitat</em></strong>: <em>${e.target.parentElement.parentElement.firstElementChild.alt}</em></span>
        </div>
    `;
  }));
};

// eslint-disable-next-line import/prefer-default-export
export { displayPokemon };
