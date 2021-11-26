import entrySchema from '../validation/entrySchema.js';
import * as entryService from '../services/entryService.js';

async function insertEntry(req, res) {
  if (entrySchema.validate(req.body).error || req.body.value === 0) {
    return res.status(400).send({ message: 'Bad request.' });
  }
  if (!req.locals.idUser) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  const idUser = req.locals.idUser;
  const { value, description } = req.body;

  try {
    await entryService.createEntry({ idUser, value, description });

    return res.status(201).send({ message: 'Created!' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function getEntries(req, res) {
  if (!req.locals.idUser) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }
  try {
    const idUser = req.locals.idUser;
    const entries = await entryService.getUserEntries({ idUser });
    const balance = entryService.calculateBalance({ entries });
    const response = {
      entries,
      balance,
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { insertEntry, getEntries };
