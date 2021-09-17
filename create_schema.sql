CREATE TABLE IF NOT EXISTS news
(
    id integer NOT NULL DEFAULT nextval('news_id_seq'::regclass),
    title character varying(128) COLLATE pg_catalog."default" NOT NULL,
    content character varying(8192) COLLATE pg_catalog."default" NOT NULL,
    creator character varying(64) COLLATE pg_catalog."default" NOT NULL,
    news_type character varying(64) COLLATE pg_catalog."default" NOT NULL,
    creation_date date,
    receiving_group integer[],
    CONSTRAINT news_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    password character varying(128) COLLATE pg_catalog."default" NOT NULL,
    can_write_news boolean,
    priority integer,
    receiving_group integer[],
    CONSTRAINT users_pkey PRIMARY KEY (id)
)