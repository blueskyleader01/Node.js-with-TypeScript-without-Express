# Node.js with TypeScript without Express


## Installing

npm install

## To Run project

```bash
npm run dev
    or
npm run start
```


## Create posts Table 

```bash
CREATE TABLE IF NOT EXISTS public.posts
(
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    author uuid NOT NULL,
    date_published timestamp without time zone DEFAULT now(),
    date_modified timestamp without time zone DEFAULT now(),
    approved boolean DEFAULT false,
    id integer NOT NULL DEFAULT nextval('post_id_seq'::regclass),
    CONSTRAINT posts_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;
```

## Create images Table

```bash
CREATE TABLE IF NOT EXISTS public.images
(
    id integer NOT NULL DEFAULT nextval('images_id_seq'::regclass),
    post_id integer NOT NULL,
    file_url character varying COLLATE pg_catalog."default" NOT NULL,
    file_name character varying COLLATE pg_catalog."default" NOT NULL,
    main integer NOT NULL DEFAULT 0,
    date_published timestamp without time zone NOT NULL DEFAULT now()::timestamp without time zone,
    CONSTRAINT images_pkey PRIMARY KEY (id)
)
