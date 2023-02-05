import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './js/pixabay-api.js';
import { createGalleryCards } from './js/templates/gallery-cards.js';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const gallery = new SimpleLightbox('.gallery a', {
  scrollZoom: false,
});

const pixabayApi = new PixabayAPI();

const perPage = pixabayApi.constructor.PER_PAGE;

loadMoreBtnEl.classList.add('is-hidden');

const onSearchFormSubmit = async event => {
  event.preventDefault();

  window.removeEventListener('scroll', onScroll);
  // loadMoreBtnEl.classList.add('is-hidden');

  pixabayApi.query = event.target.elements.searchQuery.value.trim();
  pixabayApi.page = 1;

  try {
    const response = await pixabayApi.fetchPhotosByQuery();

    const { data } = response;

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      event.target.reset();

      galleryListEl.innerHTML = '';

      return;
    }

    if (data.totalHits / perPage > 1) {
      window.addEventListener('scroll', onScroll);
      // loadMoreBtnEl.classList.remove('is-hidden');
    }

    galleryListEl.innerHTML = createGalleryCards(data.hits);

    gallery.refresh();

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (err) {
    console.log(err);
  }
};

// const onLoadMoreBtnClick = async event => {
//   pixabayApi.page += 1;

//   try {
//     const response = await pixabayApi.fetchPhotosByQuery();

//     const { data } = response;

//     galleryListEl.insertAdjacentHTML(
//       'beforeend',
//       createGalleryCards(data.hits)
//     );

//     gallery.refresh();

//     if (data.totalHits - pixabayApi.page * perPage <= 0) {
//       loadMoreBtnEl.classList.add('is-hidden');
//       Notify.info(`We're sorry, but you've reached the end of search results.`);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const onScroll = async event => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    pixabayApi.page += 1;

    console.log(pixabayApi.page);

    try {
      const response = await pixabayApi.fetchPhotosByQuery();

      const { data } = response;

      galleryListEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(data.hits)
      );

      gallery.refresh();

      if (data.totalHits - pixabayApi.page * perPage <= 0) {
        window.removeEventListener('scroll', onScroll);
        Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
// loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
