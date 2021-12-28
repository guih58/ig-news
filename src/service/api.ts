import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ig-news.guih58.tech//api',
});
