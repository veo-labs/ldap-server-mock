'use strict';

/**
 * Provides default route action to deal with LDAP protocol.
 *
 * @class controller
 * @static
 */

const databaseProvider = process.require('lib/databaseProvider.js');

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
  if (results.length < 1) {
    return results;
  }

  const intersection = results[0];
  for (const entries of results.slice(1)) {
    for (const entry of entries) {
      const idx = intersection.findIndex((item) => item.dn === entry.dn);
      if (idx === -1) {
        intersection.splice(idx, 1);
      }
    }
  }

  return intersection;
};

const search = (filter) => {
  const withoutParens = filter.substring(1, filter.length - 1);

  if (withoutParens.startsWith('&')) {
    return getIntersection(splitFilter(withoutParens.substring(1)).map(search));
  } else if (withoutParens.startsWith('|')) {
    return deduplicate(splitFilter(withoutParens.substring(1)).map(search).flat());
  } else if (withoutParens.startsWith('!')) {
    const filteredDns = search(withoutParens.substring(1)).map((user) => user.dn);
    return databaseProvider.getAllUsers()
      .filter((user) => !filteredDns.includes(user.dn));
  } else {
    // we do this instead of just .split('=') because filters can have "=" in the values
    const equalSignIndex = withoutParens.indexOf('=');
    const attributeName = withoutParens.substring(0, equalSignIndex);
    const attributeValue = withoutParens.substring(equalSignIndex + 1);

    return databaseProvider.getUsers(attributeName, attributeValue);
  }
};

/**
 * Authenticates a user.
 *
 * This is a mock, no verification is performed. User is authenticated.
 *
 * @method bindAction
 * @static
 * @async
 * @param {BindRequest} request LDAP request
 * @param {BindResponse} response LDAP response
 */
module.exports.bindAction = (request, response) => {
  response.end();
};

/**
 * Searches for a particular user.
 *
 * This is a mock, no verification is performed. User login is retrieved from searchFilter parameter using
 * the searchFilter from server configuration.
 *
 * @method searchAction
 * @static
 * @async
 * @param {SearchRequest} request LDAP request
 * @param {Object} request.filter LDAP filters
 * @param {SearchResponse} response LDAP response
 */
module.exports.searchAction = (request, response) => {
  const searchFilter = request.filter.toString();

  search(searchFilter).forEach((user) => response.send(user));
  response.end();
};
