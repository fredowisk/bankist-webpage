'use strict';

///////////////////////////////////////
// Modal window

const section1 = document.getElementById('section--1');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navs = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const sliderLeftButton = document.querySelector('.slider__btn--left');
const sliderRightButton = document.querySelector('.slider__btn--right');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabsContent = document.querySelectorAll('.operations__content');
const sections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleKeyDown = function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden'))
    return closeModal();

  if (event.key === 'ArrowLeft') return handleLeftButtonClick();
  if (event.key === 'ArrowRight') return handleRightButtonClick();
};

const scrollWindowToElement = function () {
  this.scrollIntoView({ behavior: 'smooth' });
};

const navigateWithLinks = function (event) {
  event.preventDefault();

  if (event.target.tagName !== 'A') return;

  const id = event.target.getAttribute('href');
  const element = document.querySelector(id);

  scrollWindowToElement.call(element);
};

const handleTabsContent = function (event) {
  const clickedButton = event.target.closest('.operations__tab');

  if (!clickedButton) return;

  // tabs.forEach(button => button.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // clickedButton.classList.add('operations__tab--active');

  const contentDataset = clickedButton.dataset.tab - 1;
  tabsContent[contentDataset].classList.add('operations__content--active');
};

const handleNavBar = function (event) {
  const hoveredLink = event.target;
  if (hoveredLink.classList.contains('nav__link')) {
    const closestNav = hoveredLink.closest('.nav');
    const siblings = closestNav.querySelectorAll('.nav__link');
    const logo = closestNav.querySelector('img');

    siblings.forEach(link => {
      if (link !== hoveredLink) link.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const handleStickyNav = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
    return;
  }

  nav.classList.add('sticky');
};

const observeHeader = function () {
  const navHeight = nav.getBoundingClientRect();
  const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight.height}px`,
  };

  const headerObserver = new IntersectionObserver(
    handleStickyNav,
    observerOptions
  );

  headerObserver.observe(header);
};

const handleSectionsAnimation = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const observeSections = function () {
  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const sectionObserver = new IntersectionObserver(
    handleSectionsAnimation,
    observerOptions
  );

  sections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
};

const handleLazyImages = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

const lazyLoadingImages = function () {
  const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  };
  const imgObserver = new IntersectionObserver(
    handleLazyImages,
    observerOptions
  );

  imgTargets.forEach(img => imgObserver.observe(img));
};

const handleSlideComponent = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    entry.target.style.overflow = 'hidden';
    return;
  }

  entry.target.style.overflow = 'visible';
};

const observeSlider = function () {
  const observerOptions = {
    root: null,
    threshold: 0,
  };
  const slideObserver = new IntersectionObserver(
    handleSlideComponent,
    observerOptions
  );
  slideObserver.observe(slider);
};

const allDots = [];

const createSlider = function () {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
    createDot(index);
  });
  allDots.push(...dotContainer.querySelectorAll('.dots__dot'));
};

const createDot = function (index) {
  dotContainer.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-slide="${index}"></button>`
  );
};

const changeActiveDot = function (currentIndex) {
  const activeDot = allDots[currentIndex];

  activeDot.classList.add('dots__dot--active');

  allDots.forEach(dot => {
    if (dot !== activeDot) dot.classList.remove('dots__dot--active');
  });
};

const handleDots = function (event) {
  const clickedDot = event.target;

  if (clickedDot.classList.contains('dots__dot')) {
    currentSlide = Number(clickedDot.dataset.slide);
    changeSlide();
  }
};

(() => {
  observeHeader();
  observeSections();
  lazyLoadingImages();
  observeSlider();
  createSlider();
  changeActiveDot(0);
})();

let currentSlide = 0;

const changeSlide = function () {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
  });
  changeActiveDot(currentSlide);
};

const handleLeftButtonClick = function () {
  currentSlide--;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  changeSlide();
};

const handleRightButtonClick = function () {
  currentSlide++;
  if (currentSlide > slides.length - 1) currentSlide = 0;
  changeSlide();
};

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', handleKeyDown);

nav.addEventListener('mouseover', handleNavBar.bind(0.5));
nav.addEventListener('mouseout', handleNavBar.bind(1));
navs.addEventListener('click', navigateWithLinks);

btnsOpenModal.forEach(button => button.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
btnScrollTo.addEventListener('click', scrollWindowToElement.bind(section1));
sliderLeftButton.addEventListener('click', handleLeftButtonClick);
sliderRightButton.addEventListener('click', handleRightButtonClick);

tabsContainer.addEventListener('click', handleTabsContent);
dotContainer.addEventListener('click', handleDots);

// window.addEventListener('scroll', handleWindowScroll);
