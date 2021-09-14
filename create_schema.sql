CREATE TABLE IF NOT EXISTS news
(
    id serial NOT NULL,
    creator varchar(64) NOT NULL,
    title varchar(512) NOT NULL,
    content text NOT NULL,
    news_type varchar(64) NOT NULL,
    PRIMARY KEY (id)
);