import * as sessionRepository from '../repositories/sessionRepository.js';
import { v4 as uuid } from 'uuid';

async function createSession({ idUser }) {
  const token = uuid();

  const session = await sessionRepository.registerSession({ idUser, token });

  return session;
}

async function removeSession({ token }) {
  const result = sessionRepository.deleteSession({ token });
  return result;
}

export { createSession, removeSession };
