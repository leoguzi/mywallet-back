import express from "express";
import cors from "cors";
import { registerUser, logIn, logOut } from "./controllers/users.js";

const server = express();
server.use(cors());
server.use(express.json());

//USERS
server.post("/register", registerUser);
server.post("/login", logIn);
server.post("/logout", logOut);

export default server;
