import './sass/main.scss';

import Notiflix, { Notify } from 'notiflix';
const axios = require('axios').default;

const Baze_Url = 'https://pixabay.com/api/';
const Personal_KEY = '27100740-5d55e6a09fbc0a6643f2ff592';

const formInput = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

let page = 1;
let perPage = 40;
loadMoreBtn.classList.add('is-hidden');

formInput.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', showMorePictures);

function handleSearch(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  const inputValue = input.value;
  if (inputValue === '') {
    return;
  }
  gallery.innerHTML ='';
  page = 1;
  loadMoreBtn.classList.remove('is-hidden');
  fetchPictures(inputValue).then(response => runderGallery(response));
}

function fetchPictures(picName) {
  return fetch(
    `${Baze_Url}?key=${Personal_KEY}&q=${picName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  )
    .then(response => {
      if (response.ok) {
        //   console.log(response.json())
        return response.json();
      }
      throw new Error();
    })
    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      ),
    );
}

function runderGallery(pictures) {
  if (pictures.totalHits === 0) {
    loadMoreBtn.classList.add('is-hidden');
    return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  const galleryList = pictures.hits
    .map(picture => {
      return `<div class="photo-card">
        <img src='${picture.webformatURL}' alt="${Object.values(picture.tags)}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${picture.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${picture.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${picture.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${picture.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', galleryList);
}

function showMorePictures() {
  page += 1;
  fetchPictures(input.value).then(runderGallery);
}
