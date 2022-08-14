const backdrop = document.querySelector(".backdrop");
const hamburgerMobile = document.querySelector(".hamburger-mobile");
const closeMobile = document.querySelector(".nav-mobile__close");
const navbarMobile = document.querySelector(".nav-mobile");

const navbarMobileOpen = function () {
  navbarMobile.classList.add("nav-mobile__active");
  backdrop.classList.add("backdrop-active");
};

const navbarMobileClose = function () {
  navbarMobile.classList.remove("nav-mobile__active");
  backdrop.classList.remove("backdrop-active");
};

backdrop.addEventListener("click", navbarMobileClose);
hamburgerMobile.addEventListener("click", navbarMobileOpen);
closeMobile.addEventListener("click", navbarMobileClose);
