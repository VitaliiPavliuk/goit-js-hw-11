import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '33371810-0a52094386dea8583f801697d';
  static PER_PAGE = 40;

  constructor() {
    this.page = null;
    this.query = null;
  }

  fetchPhotosByQuery() {
    const searchParams = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: PixabayAPI.PER_PAGE,
      },
    };

    return axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
  }
}
