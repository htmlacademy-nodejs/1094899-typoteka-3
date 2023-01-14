'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);
const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments, categoryId}) {
    return this._load(`/articles`, {params: {offset, limit, comments, categoryId}});
  }

  getArticle(id, comments = false) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count = false) {
    return this._load(`/category`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
