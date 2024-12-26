--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE winsy;
ALTER ROLE winsy WITH NOSUPERUSER INHERIT NOCREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:h21wsigK5YfA0TXBRdl5QA==$Fq1tPVNcCV4QygSj6myKp0tsB9ZE2Df+ZPzj3wkGCd4=:H9mbeP1K/9NkSf/6TKk6UclzXVWHuyxKKXIWOG5YyLs=';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "schedule_optimizer" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: schedule_optimizer; Type: DATABASE; Schema: -; Owner: winsy
--

CREATE DATABASE schedule_optimizer WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C.UTF-8';


ALTER DATABASE schedule_optimizer OWNER TO winsy;

\connect schedule_optimizer

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Playlist; Type: TABLE; Schema: public; Owner: winsy
--

CREATE TABLE public."Playlist" (
    id text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Playlist" OWNER TO winsy;

--
-- Name: PlaylistToSong; Type: TABLE; Schema: public; Owner: winsy
--

CREATE TABLE public."PlaylistToSong" (
    "playlistId" text NOT NULL,
    "songId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PlaylistToSong" OWNER TO winsy;

--
-- Name: Song; Type: TABLE; Schema: public; Owner: winsy
--

CREATE TABLE public."Song" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Song" OWNER TO winsy;

--
-- Name: User; Type: TABLE; Schema: public; Owner: winsy
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO winsy;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: winsy
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO winsy;

--
-- Data for Name: Playlist; Type: TABLE DATA; Schema: public; Owner: winsy
--

COPY public."Playlist" (id, name, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PlaylistToSong; Type: TABLE DATA; Schema: public; Owner: winsy
--

COPY public."PlaylistToSong" ("playlistId", "songId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Song; Type: TABLE DATA; Schema: public; Owner: winsy
--

COPY public."Song" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: winsy
--

COPY public."User" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: winsy
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
fad1c1fa-20be-4daa-bca3-b89e9131593d	3ea55bff7ba6084b38cf35a384bff50c14d5c80d41517cd2ed3237bae2ea4f8f	2024-12-02 18:54:37.998741-08	20231127012826_initial	\N	\N	2024-12-02 18:54:37.963451-08	1
18f8f73e-dd5a-4303-b9c7-4ad4abee52c3	dfe90fc31945fee375e4cfa1f5e52bd068d818ea768f81821859ea44fc0c8fa4	2024-12-02 18:54:38.008397-08	20231127015514_playlist_to_song_composite_id	\N	\N	2024-12-02 18:54:38.001597-08	1
4fbb1638-7957-4b4e-b395-b4d56adb7df2	c5597e59954086cbe741aebcb820b27fa1c6dbe6d92adcdfdca54b0845b4a218	2024-12-02 18:54:38.014971-08	20240214070012_reset_database	\N	\N	2024-12-02 18:54:38.011047-08	1
\.


--
-- Name: PlaylistToSong PlaylistToSong_pkey; Type: CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."PlaylistToSong"
    ADD CONSTRAINT "PlaylistToSong_pkey" PRIMARY KEY ("playlistId", "songId");


--
-- Name: Playlist Playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."Playlist"
    ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY (id);


--
-- Name: Song Song_pkey; Type: CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."Song"
    ADD CONSTRAINT "Song_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: PlaylistToSong PlaylistToSong_playlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."PlaylistToSong"
    ADD CONSTRAINT "PlaylistToSong_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES public."Playlist"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlaylistToSong PlaylistToSong_songId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."PlaylistToSong"
    ADD CONSTRAINT "PlaylistToSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES public."Song"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Playlist Playlist_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: winsy
--

ALTER TABLE ONLY public."Playlist"
    ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

