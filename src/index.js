console.log('Hello1');

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { PixabayAPI } from './js/pixabay-api.js';
import { createGalleryCards } from './js/templates/gallery-cards.js';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayApi = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabayApi.query = event.target.elements.searchQuery.value.trim();
  pixabayApi.page = 1;

  try {
    const response = await pixabayApi.fetchPhotosByQuery();

    const { data } = response;

    console.log(data);
    console.log(data.hits);
    // console.log(data.totalHits);
    // console.log(data.hits.length);

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      event.target.reset();

      galleryListEl.innerHTML = '';

      //   loadMoreBtnEl.classList.add('is-hidden');

      return;
    }

    if (data.totalHits / data.hits.length > 1) {
      //   loadMoreBtnEl.classList.remove('is-hidden');
      console.log('More');
    }

    galleryListEl.innerHTML = createGalleryCards(data.hits);
  } catch (err) {
    console.log(err);
  }
};

// const onLoadMoreBtnClick = async event => {
//   unsplashApi.page += 1;

//   try {
//     const response = await unsplashApi.fetchPhotosByQuery();

//     const { data } = response;

//     galleryListEl.insertAdjacentHTML(
//       'beforeend',
//       createGalleryCards(data.results)
//     );

//     if (unsplashApi.page === data.total_pages) {
//       loadMoreBtnEl.classList.add('is-hidden');
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

searchFormEl.addEventListener('submit', onSearchFormSubmit);
// loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

//           Notify.info(
//             'We're sorry, but you've reached the end of search results.'
//           );
