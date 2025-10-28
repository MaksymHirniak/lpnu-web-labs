const burgerMenu = document.querySelector(".burger-menu");
const mobileNav = document.querySelector(".mobile-nav");
const closeBtn = document.querySelector(".close-btn");

function toggleMenu() {
  mobileNav.classList.toggle("is-open");
}
burgerMenu.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
