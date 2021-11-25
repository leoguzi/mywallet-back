import joi from 'joi';

const entrySchema = joi.object({
  value: joi.number().required(),
  description: joi.string().min(3).max(50).required(),
});

export default entrySchema;
