'use strict';

require('./processRequire.js');
const nopt = require('nopt');
const Server = process.require('lib/Server.js');
const conf = process.require('lib/conf.js');
const database = process.require('lib/database.js');

// Process list of arguments
const knownProcessOptions = {
  conf: [String],
  database: [String]
};

// Parse process arguments
const processOptions = nopt(knownProcessOptions, null, process.argv);

// Load database and configuration file
try {
  conf.server = require(processOptions.conf);
  database.users = require(processOptions.database);
} catch (error) {
  throw new Error(`Invalid arguments: ${error.message}`);
}

// Set configuration default values
conf.server.userLoginAttribute = conf.server.userLoginAttribute || 'cn';
conf.server.searchFilter = conf.server.searchFilter || '(&(objectclass=person)(cn={{username}}))';
conf.server.searchBase = conf.server.searchBase || 'dc=test';
conf.server.port = conf.server.port || 3004;

if (!conf.server.searchBase)
  throw new Error('Missing searchBase property in configuration');

const server = new Server(conf.server.port);
server.start();
