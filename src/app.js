import express from "express";
import cors from "cors";
import { registerUser, logIn, logOut } from "./controllers/users.js";
import { insertEntrie } from "./controllers/entries.js";

const server = express();
server.use(cors());
server.use(express.json());

//USERS
server.post("/register", registerUser);
server.post("/login", logIn);
server.post("/logout", logOut);

//ENTRIES

server.post("/entries", insertEntrie);

export default server;
