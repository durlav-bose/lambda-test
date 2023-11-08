const joi = require('joi');

const envVarsSchema = joi
  .object({
    DO_SPACES_ENDPOINT: joi.string().required(),
    DO_SPACES_KEY: joi.string().required(),
    DO_SPACES_SECRET: joi.string().required(),
    DO_SPACES_NAME: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  s3: {
    endpoint: envVars.DO_SPACES_ENDPOINT,
    key: envVars.DO_SPACES_KEY,
    secret: envVars.DO_SPACES_SECRET,
    name: envVars.DO_SPACES_NAME,
  },
};

module.exports = config;
