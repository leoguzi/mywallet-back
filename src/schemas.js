import joi from 'joi';

const userSchema = joi.object({
  name: joi.string().min(2).max(30).required(),

  // eslint-disable-next-line newline-per-chained-call
  email: joi.string().email().min(3).max(30).required(),
  password: joi.string().required(),
  passwordConfirm: joi.string().required().valid(joi.ref('password')),
});

const entrySchema = joi.object({
  value: joi.number().required(),
  description: joi.string().min(3).max(50).required(),
});

export { userSchema, entrySchema };
