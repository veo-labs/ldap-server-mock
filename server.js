#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("node:fs/promises"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const server_1 = require("./lib/server");
function exit(error, code = 1) {
    if (error) {
        console.log('error: %s', error);
    }
    printHelp();
    process.exitCode = 1;
}
function getArguments() {
    let confFilePath = '';
    let databaseFilePath = '';
    for (let i = 2; i < process.argv.length; i++) {
        const argChunks = process.argv[i].match(/--(conf|database)=(.*)/);
        if (!argChunks) {
            break;
        }
        switch (argChunks[1]) {
            case 'conf':
                confFilePath = node_path_1.default.resolve(argChunks[2]);
                break;
            case 'database':
                databaseFilePath = node_path_1.default.resolve(argChunks[2]);
                break;
            default:
                throw new Error(`unexpected option ${argChunks[1]}`);
                break;
        }
    }
    if (!confFilePath) {
        throw new Error('missing --conf option');
    }
    if (!databaseFilePath) {
        throw new Error('missing --database option');
    }
    return { confFilePath, databaseFilePath };
}
async function main() {
    let args;
    try {
        args = getArguments();
    }
    catch (error) {
        exit(error.message);
        return;
    }
    let configurationFilePath = args.confFilePath;
    let databaseFilePath = args.databaseFilePath;
    process.on('SIGTERM', async () => {
        if (server) {
            await server.stop();
        }
    });
    let serverConfiguration;
    let users = [];
    try {
        serverConfiguration = require(configurationFilePath);
        users = require(databaseFilePath);
    }
    catch (error) {
        exit(error.message);
        return;
    }
    let certificatePublicKey;
    let certificatePrivateKey;
    if (serverConfiguration.certPath && serverConfiguration.certKeyPath) {
        try {
            certificatePublicKey = await fs.readFile(node_path_1.default.resolve(serverConfiguration.certPath));
            certificatePrivateKey = await fs.readFile(node_path_1.default.resolve(serverConfiguration.certKeyPath));
        }
        catch (error) {
            exit(error.message);
            return;
        }
    }
    const server = new server_1.LdapServerMock(users, serverConfiguration, certificatePublicKey, certificatePrivateKey);
    await server.start();
}
function printHelp() {
    console.log(`
usage: npx ldap-server-mock options
options:
  --conf="file"        relative or absolute path to the server configuration file
  --database="file"    relative or absolute path to the file containing LDAP users in JSON format
  `);
}
main();
