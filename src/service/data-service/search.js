'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    return this._articles.
      filter((articles) => articles.title.includes(searchText));
  }

}

module.exports = SearchService;
