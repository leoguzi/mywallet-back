import express from "express";
import cors from "cors";
import { registerUser } from "./controllers/users.js";

const server = express();
server.use(cors());
server.use(express.json());

//USERS
server.post("/users/register", registerUser);

export default server;
