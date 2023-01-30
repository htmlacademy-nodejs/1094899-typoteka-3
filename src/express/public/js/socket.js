'use strict';

(() => {
  const SERVER_URL = `http://localhost:8080`;

  const socket = io(SERVER_URL);

  const removeChildren = (listElement) => {
    let child = listElement.lastElementChild;
    while (child) {
      listElement.removeChild(child);
      child = listElement.lastElementChild;
    }
  }

  const renderTopComments = (topComments) => {
    const listWrapper = document.querySelector('.last__list');
    if (listWrapper) {
      removeChildren(listWrapper);

      topComments.forEach(comment => {
        const commentTemplate = document.querySelector('#comment-template');
        const commentElement = commentTemplate.cloneNode(true).content;

        commentElement.querySelector('.last__list-image').src = `/img/${comment['users.avatar']}`;
        commentElement.querySelector('.last__list-name').textContent = comment['users.name'];
        commentElement.querySelector('.last__list-link').href = `/articles/${comment.articleId}/#comments`;
        commentElement.querySelector('.last__list-link').textContent = comment.text;

        listWrapper.append(commentElement);
      });
    }
  }

  const renderTopArticles = (topArticles) => {
    const listWrapper = document.querySelector('.hot__list');
    if (listWrapper) {
      removeChildren(listWrapper);

      topArticles.forEach(article => {
        const articleTemplate = document.querySelector('#article-template');
        const articleElement = articleTemplate.cloneNode(true).content;

        articleElement.querySelector('.hot__list-link').href = `/articles/${article.id}`;
        articleElement.querySelector('.hot__link-text').textContent = article.text;
        articleElement.querySelector('.hot__link-sup').textContent = article.count;

        listWrapper.append(articleElement);
      });
    }
  }

  socket.addEventListener('comment:create', (data) => {
    const { topArticles, topComments } = data;
    renderTopComments(topComments);
    renderTopArticles(topArticles);
  })
})();
