'use strict';

const path = require('path');

// Set module root directory and define a custom require function to be able to include modules from projet's
// root directory
process.root = __dirname;
process.require = (filePath) => require(path.join(process.root, filePath));
