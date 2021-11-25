import joi from 'joi';

const userSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().min(3).max(30).required(),
  password: joi.string().required(),
  passwordConfirm: joi.string().required().valid(joi.ref('password')),
});

export default userSchema;
