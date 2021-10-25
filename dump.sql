--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

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
-- Name: entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entries (
    id integer NOT NULL,
    user_id integer,
    date date,
    value numeric,
    description text
);


ALTER TABLE public.entries OWNER TO postgres;

--
-- Name: entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entries_id_seq OWNER TO postgres;

--
-- Name: entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entries_id_seq OWNED BY public.entries.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer,
    token text
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text,
    password text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entries ALTER COLUMN id SET DEFAULT nextval('public.entries_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entries (id, user_id, date, value, description) FROM stdin;
34	7	2021-10-23	9000	Pizza
36	7	2021-10-23	110000	Pagote Outubro
37	7	2021-10-23	15000	Terapia para não surtar tão rapido rs
39	7	2021-10-23	1290	Cigarro
40	7	2021-10-23	5070	Bebidinha do fds
41	7	2021-10-23	-100	Jogo do Bicho
42	7	2021-10-23	-100	Megasena
43	7	2021-10-23	-30025	Será que agora vai?
44	7	2021-10-23	-125	Chicletisss
45	7	2021-10-23	-10	só pra arredondar
46	7	2021-10-23	-150000	uhul TA FUNFANDO
47	7	2021-10-23	530000	PROGRAMADORAAHHH
48	7	2021-10-23	10000	vEMMMM OVERFLOWWWU
49	7	2021-10-23	-15000	Drogas (lícitas)
50	7	2021-10-23	-25000	só pra garantir
51	7	2021-10-23	-100225	aaaa
52	10	2021-10-23	530000	Vem salario dev driven
184	7	2021-10-24	-2500	coxinha do domingão
185	7	2021-10-24	-2500	coxinha do domingão
186	7	2021-10-24	-2600	Ração do gato
187	474	2021-10-24	-25000	Omega 3 da topterm
188	474	2021-10-24	250000	Salário do mês.
189	474	2021-10-24	-5000000	emprestimo pra parente
190	474	2021-10-24	5000000	devolveuuu
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, token) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password) FROM stdin;
7	Leonardo Guzi	leoguzi@hotmail.com	$2b$10$yNnuJJ19qgTwjb.e3631yellxf.K.3fwoODPkQLstdyGvCmhbMPQ.
8	Vania Dalamaria	vania@gmail.com	$2b$10$stOEyucJB7OGGjUPsXg8Be6xoppGrTVOxEeTJXBORO7IIobiRuW2O
9	User	user@user.com	$2b$10$EcE.LyRloeH6sxEbNmb0MOd/gHKVvkIFvYGW0cpsug67swO.hBCIy
10	Raposinha Sapeca	raposinha@cogumelos.com	$2b$10$Ahb.4VyHUdB5mzIPwL2/dODbz1EvwJ1fLLW1cu4H17q6dXWAScnWy
474	Vania Dalamaria	vaniadalamaria@gmail.com	$2b$10$cmNjj/yz6KcQBXH6kNZNROhvVyoySKN9xgSQn1VsvqX2q0b.ujVRe
\.


--
-- Name: entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entries_id_seq', 228, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 537, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 926, true);


--
-- PostgreSQL database dump complete
--

