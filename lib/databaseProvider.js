'use strict';

/**
 * Manages the database of LDAP users.
 *
 * @class databaseProvider
 * @static
 */

const database = process.require('lib/database.js');

const getWithNormalizedKey = (obj, normalizedKey) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key.toLowerCase() === normalizedKey) {
      return value;
    }
  }
};

const deduplicate = (entries) => {
  const unique = [];
  entries.forEach((entry) => {
    if (!unique.some((item) => item.dn === entry.dn)) {
      unique.push(entry);
    }
  });

  return unique;
};

const getIntersection = (results) => {
  let intersection = results.shift();
  for (const entries of results) {
    const newIntersection = [];
    for (const entry of entries) {
      if (intersection.some((item) => item.dn === entry.dn)) {
        newIntersection.push(entry);
      }
    }

    intersection = newIntersection;
  }

  return intersection;
};

const splitFilter = (filter) => {
  const parts = [];

  let parenCount = 0;
  let start = 0;
  Array.from(filter).forEach((char, i) => {
    if (char === '(') {
      parenCount++;
    } else if (char === ')') {
      parenCount--;
    }

    if (parenCount === 0) {
      parts.push(filter.substring(start, i + 1));
      start = i + 1;
    }
  });

  return parts;
};

const getAllUsers = () => {
  return database.users.map((user) => {
    const {dn, ...attributes} = user;
    return {dn, attributes};
  });
};

const getUsers = (attributeName, searchValue) => {
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

/**
 * Searches the database.
 *
 * @method search
 * @static
 * @params {String} filter An LDAP search filter
 * @return {Array<Object>} An array of user objects matching the filter
 */
const search = (filter) => {
  const withoutParens = filter.substring(1, filter.length - 1);

  if (withoutParens.startsWith('&')) {
    return getIntersection(splitFilter(withoutParens.substring(1)).map(search));
  } else if (withoutParens.startsWith('|')) {
    return deduplicate(splitFilter(withoutParens.substring(1)).map(search).flat());
  } else if (withoutParens.startsWith('!')) {
    const filteredDns = search(withoutParens.substring(1)).map((user) => user.dn);
    return getAllUsers().filter((user) => !filteredDns.includes(user.dn));
  } else {
    // we do this instead of just .split('=') because filters can have "=" in the values
    const equalSignIndex = withoutParens.indexOf('=');
    const attributeName = withoutParens.substring(0, equalSignIndex);
    const attributeValue = withoutParens.substring(equalSignIndex + 1);

    return getUsers(attributeName, attributeValue);
  }
};

module.exports.search = search;
