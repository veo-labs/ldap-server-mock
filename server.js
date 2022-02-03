#!/usr/bin/env node

'use strict';

require('./processRequire.js');
const path = require('path');
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
  let confPath = processOptions.conf;
  let databasePath = processOptions.database;
  if (!path.isAbsolute(processOptions.conf)) confPath = path.join(process.cwd(), processOptions.conf);
  if (!path.isAbsolute(processOptions.database)) databasePath = path.join(process.cwd(), processOptions.database);

  conf.server = require(confPath);
  database.users = require(databasePath);
} catch (error) {
  throw new Error(`Invalid arguments: ${error.message}`);
}

// Set configuration default values
conf.server.userLoginAttribute = conf.server.userLoginAttribute || 'cn';
conf.server.searchBase = conf.server.searchBase || 'dc=test';
conf.server.port = conf.server.port || 3004;

if (!conf.server.searchBase)
  throw new Error('Missing searchBase property in configuration');

const server = new Server(conf.server.port);
server.start();
