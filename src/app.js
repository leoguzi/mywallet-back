import express from "express";
import cors from "cors";
import { registerUser, logIn, logOut } from "./controllers/users.js";
import { getEntries, insertEntry } from "./controllers/entries.js";

const app = express();
app.use(cors());
app.use(express.json());

//USERS
app.post("/register", registerUser);
app.post("/login", logIn);
app.post("/logout", logOut);

//ENTRIES

app.post("/entries", insertEntry);
app.get("/entries", getEntries);

export default app;
