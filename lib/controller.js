'use strict';

/**
 * Provides default route action to deal with LDAP protocol.
 *
 * @class controller
 * @static
 */

const databaseProvider = process.require('lib/databaseProvider.js');
const conf = process.require('lib/conf.js');

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
  const filterPattern = conf.server.searchFilter;
  const searchFilter = request.filter.toString();

  // Extract user login name from search filter based on server configuration
  const numberOfCharactersBefore = filterPattern.indexOf('{{');
  const numberOfCharactersAfter = filterPattern.length - (filterPattern.indexOf('}}') + 2);
  const userName = searchFilter.slice(numberOfCharactersBefore, searchFilter.length - numberOfCharactersAfter);
  const user = databaseProvider.getUser(userName);

  if (user)
    response.send(user);

  response.end();
};
