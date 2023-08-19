const blur = document.getElementById('blur');
const popComment = document.getElementById('pop-comment');

const toggle = () => {
  blur.classList.toggle('active');
  popComment.classList.toggle('active');
};

export default toggle;