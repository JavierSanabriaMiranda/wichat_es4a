'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  generateCredentials: generateCredentials
};

function generateCredentials(context, events, next) {
  const uname = `User_${Date.now()}`.slice(0, 30);
  const pwd = 'Test12345';

  // Guarda en context.vars para que Artillery lo inyecte luego en {{ username }} / {{ password }}
  context.vars.username = uname;
  context.vars.password = pwd;

  return next();
}