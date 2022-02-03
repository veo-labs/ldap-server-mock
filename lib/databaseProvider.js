'use strict';

/**
 * Manages the database of LDAP users.
 *
 * @class databaseProvider
 * @static
 */

const database = process.require('lib/database.js');
const conf = process.require('lib/conf.js');

const getWithNormalizedKey = (obj, normalizedKey) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key.toLowerCase() === normalizedKey) {
      return value;
    }
  }
};

/**
 * Fetches user from database.
 *
 * User attribute containing the login is defined by the userLoginAttribute property of the server configuration.
 *
 * @method getUser
 * @static
 * @params {String} login User login
 * @return {Object} The user as is
 */
module.exports.getUser = (login) => {
  const users = database.users;
  const loginAttribute = conf.server.userLoginAttribute;
  let fetchedUser;
  let user = {attributes: {}};

  for (let user in users) {
    if (users[user][loginAttribute] === login) {
      fetchedUser = users[user];
      break;
    }
  }

  if (!fetchedUser) return null;

  user.dn = fetchedUser.dn;
  for (let propertyName in fetchedUser) {
    if (propertyName !== 'dn')
      user.attributes[propertyName] = fetchedUser[propertyName];
  }

  return user;
};

module.exports.getAllUsers = () => {
  return database.users.map((user) => {
    const {dn, ...attributes} = user;
    return {dn, attributes};
  });
};

module.exports.getUsers = (attributeName, searchValue) => {
  return database.users
    .filter((user) => {
      const searchRegex = new RegExp(`^${searchValue.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '.*')}$`);
      const value = getWithNormalizedKey(user, attributeName);
      return Array.isArray(value) ? value.some((item) => searchRegex.test(item)) : searchRegex.test(value);
    })
    .map((user) => {
      const {dn, ...attributes} = user;
      return {dn, attributes};
    });
};
