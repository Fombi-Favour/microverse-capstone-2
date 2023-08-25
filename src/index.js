import { displayPokemon } from './modules/display.js';
import './styles/style.css';
// eslint-disable-next-line import/no-duplicates
import Logo from './asset/logo.png';
// eslint-disable-next-line import/no-duplicates
import Logo1 from './asset/logo.png';

const logo = document.getElementById('logo');
logo.src = Logo;

const logo1 = document.getElementById('logo1');
logo1.src = Logo1;

const menuNav = document.getElementById('menuNav');
const menu = document.querySelector('#menu');
const close = document.querySelector('#close');

function showMenu() {
  menuNav.style.left = '0';
}

function hideMenu() {
  menuNav.style.left = '48rem';
}

menu.addEventListener('click', () => {
  showMenu();
});

close.addEventListener('click', () => {
  hideMenu();
});

displayPokemon();