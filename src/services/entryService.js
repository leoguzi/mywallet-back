import * as entryRepository from '../repositories/entryRepository.js';

async function createEntry({ idUser, value, description }) {
  const date = new Date();

  await entryRepository.registerEntry({
    idUser,
    value,
    description,
    date,
  });
}

async function getUserEntries({ idUser }) {
  const entries = await entryRepository.fetchUserEntries({ idUser });

  return entries;
}

function calculateBalance({ entries }) {
  const sum = entries.reduce((sum, entry) => sum + entry.value, 0);
  return sum;
}

export { createEntry, getUserEntries, calculateBalance };
