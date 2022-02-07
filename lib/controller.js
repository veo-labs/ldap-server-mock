'use strict';

/**
 * Provides default route action to deal with LDAP protocol.
 *
 * @class controller
 * @static
 */

const databaseProvider = process.require('lib/databaseProvider.js');

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
 * Search for users.
 *
 * This is a mock, no verification is performed. Users are filtered based on the filter.
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

  databaseProvider.search(searchFilter).forEach((user) => response.send(user));
  response.end();
};
