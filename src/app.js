import express from 'express';
import cors from 'cors';
import { sessionAuthentication } from './middlewares/auth.js';
import { registerUser, logIn, logOut } from './controllers/userController.js';
import { getEntries, insertEntry } from './controllers/entryController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', registerUser);
app.post('/login', logIn);
app.post('/logout', logOut);

app.post('/entries', sessionAuthentication, insertEntry);
app.get('/entries', sessionAuthentication, getEntries);

export default app;
