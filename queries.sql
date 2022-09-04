-- Получить список всех категорий
select
	c.id,
	c.name
from categories c;

-- Получить список категорий, для которых создана минимум одна публикация
select
	ac.category_id,
	c.name
from article_categories ac
  inner join categories c on ac.category_id = c.id
group by ac.category_id, c.name;

-- Получить список категорий с количеством публикаций
select
	c.id,
	c.name,
	count(a.id)
from categories c
  left join article_categories ac on ac.category_id = c.id
  left join articles a on ac.article_id = a.id
group by c.id, c.name;

--Получить список публикаций /Сначала свежие публикации
select
	a.id,
	a.title,
	a.announce,
	a.created_at,
	u.first_name,
  u.last_name,
  u.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
from articles a
  JOIN article_categories ON a.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = a.id
  JOIN users u ON u.id = a.user_id
group by a.id, u.id
order by a.created_at desc;

-- Полная информация по объявлению
SELECT
  articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
GROUP BY articles.id, users.id;

 --Получить список из 5 свежих комментариев
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC
LIMIT 5;

--Получить список комментариев для определённой публикации / Сначала новые комментарии
 SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_at desc;

-- Обновить заголовок
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
