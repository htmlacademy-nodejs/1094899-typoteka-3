-- добавление пользователей
INSERT INTO users(email, password_hash, first_name, last_name, is_admin) VALUES
('ivanov1@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', true),
('petrov1@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', false);

-- добавление категорий
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

-- добавление статей
ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, announce, "text", image, user_id) VALUES
(
	'Учим HTML и CSS',
	'Программировать не настолько сложно, как об этом говорят.',
	'Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.',
	null,
	1
),
(
	'Рок — это протест',
	'Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?',
	'Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов.',
	null,
	1
),
(
	'Что такое золотое сечение',
	'Золотое сечение — соотношение двух величин, гармоническая пропорция.',
	'Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.',
	'img1.jpg',
	1
);

ALTER TABLE articles ENABLE TRIGGER ALL;

-- добавление связи категорий со статьями
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 1);
ALTER TABLE article_categories ENABLE TRIGGER ALL;

-- добавление комментариев
ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO comments("text", user_id, article_id) VALUES
('Это где ж такие красоты?', 1, 1),
('Совсем немного...', 2, 1),
('Согласен с автором!', 1, 2),
('Мне кажется или я уже читал это где-то?', 2, 2),
('Плюсую, но слишком много буквы!', 1, 3),
('Планируете записать видосик на эту тему?', 2, 3);

ALTER TABLE comments ENABLE TRIGGER ALL;
