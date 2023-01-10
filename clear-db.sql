-- очистка содержимого таблиц
truncate public.categories CASCADE;
truncate public.users CASCADE;
truncate public.articles CASCADE;
truncate public.comments CASCADE;
truncate public.article_category CASCADE;

-- сброс автоинкрементов ID
alter sequence users_id_seq restart;
alter sequence categories_id_seq restart;
alter sequence articles_id_seq restart;
alter sequence comments_id_seq restart;
