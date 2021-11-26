import * as sessionService from '../services/sessionService.js';

async function sessionAuthentication(req, res, next) {
  const idUser = null;
  req.locals = {
    idUser,
  };

  if (!req.headers.authorization) {
    return next();
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const session = await sessionService.getSession({ token });

    if (!session) {
      return next();
    }

    req.locals.idUser = session.user_id;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { sessionAuthentication };
