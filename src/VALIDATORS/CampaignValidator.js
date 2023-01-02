import Joi from "joi"

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false })

const campaignSchema = Joi.object({
  name: Joi.string().min(2).max(40).required().label("Name must be min of 2 and max of 40 characters").trim(),
  from_date: Joi.date().required().label("Kindly add a valid date"),
  to_date: Joi.date().required().label("Kindly add a valid date"),
  total_budget: Joi.number().precision(2).required(),
  daily_budget: Joi.number().precision(2).required(),
}).options({ allowUnknown: true })

export const validateCampaign = validator(campaignSchema)
