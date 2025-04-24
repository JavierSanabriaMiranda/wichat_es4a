'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  generateCredentials: generateCredentials
};

function generateCredentials(context, events, next) {
  // Usa el método correcto de Faker
  const randomName = faker.internet.username();

  // Añádele algo para garantizar unicidad (timestamp o UUID)
  const uniqueSuffix = Date.now();              // o faker.datatype.uuid()
  const uname = `${randomName}_${uniqueSuffix}`;
  const pwd   = 'Test1234';

  // Guarda en context.vars para que Artillery lo inyecte luego en {{ username }} / {{ password }}
  context.vars.username = uname;
  context.vars.password = pwd;

  return next();
}