import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';

async function getUserByEmail({ email }) {
  const user = await userRepository.fetchUserByEmail({ email });

  return user;
}

async function createUser({ name, email, password }) {
  const encriptedPassword = bcrypt.hashSync(password, 10);

  await userRepository.registerUser({
    name,
    email,
    password: encriptedPassword,
  });
}

function validatePassword({ password, userPassword }) {
  return bcrypt.compareSync(password, userPassword);
}

export { getUserByEmail, createUser, validatePassword };
