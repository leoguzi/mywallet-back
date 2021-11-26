import userSchema from '../validation/userSchema.js';
import * as userService from '../services/userService.js';
import * as sessionService from '../services/sessionService.js';

async function registerUser(req, res) {
  if (userSchema.validate(req.body).error) {
    return res.status(400).send({ message: 'Bad request.' });
  }

  const { name, email, password } = req.body;

  try {
    const user = await userService.getUserByEmail({ email });

    if (user) {
      return res.status(409).send({ message: 'E-mail already used!' });
    }

    await userService.createUser({ name, email, password });

    return res.status(201).send({ message: 'Created!' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Bad request.' });
  }

  try {
    const user = await userService.getUserByEmail({ email });

    if (!user) {
      return res.status(404).send({ message: 'E-mail not found!' });
    }

    const isPasswordValid = userService.validatePassword({
      password,
      userPassword: user.password,
    });

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password!' });
    }

    const session = await sessionService.createSession({ idUser: user.id });

    return res.status(200).send({ name: user.name, token: session.token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logOut(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ message: 'Bad request.' });
  }

  try {
    const result = await sessionService.removeSession({ token });

    if (!result) {
      return res.status(404).send({ message: 'Invalid token!' });
    }

    return res.status(200).send({ message: 'Logged out.' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { registerUser, logIn, logOut };
