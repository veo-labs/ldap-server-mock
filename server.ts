#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import path from 'node:path';

import { LdapServerMockConfiguration } from './lib/configuration';
import { LdapServerMock } from './lib/server';
import { LdapUser } from './lib/user';

type Arguments = { readonly confFilePath: string; readonly databaseFilePath: string };

/**
 * Exits program and print help.
 *
 * @param error The error message to print before printing help
 * @param code The exit code
 */
function exit(error?: string, code = 1): void {
  if (error) {
    console.log('error: %s', error);
  }

  printHelp();
  process.exitCode = 1;
}

/**
 * Parses command line arguments.
 *
 * @return args The list of parsed arguments
 */
function getArguments(): Arguments {
  let confFilePath: string = '';
  let databaseFilePath: string = '';

  for (let i = 2; i < process.argv.length; i++) {
    const argChunks: RegExpMatchArray | null = process.argv[i].match(/--(conf|database)=(.*)/);

    if (!argChunks) {
      break;
    }

    switch (argChunks[1]) {
      case 'conf':
        confFilePath = path.resolve(argChunks[2]);
        break;
      case 'database':
        databaseFilePath = path.resolve(argChunks[2]);
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

async function main(): Promise<void> {
  let args: Arguments | undefined;

  try {
    args = getArguments();
  } catch (error) {
    exit((error as Error).message);
    return;
  }

  let configurationFilePath: string = args.confFilePath;
  let databaseFilePath: string = args.databaseFilePath;

  process.on('SIGTERM', async () => {
    if (server) {
      await server.stop();
    }
  });

  // Load configuration files
  let serverConfiguration: LdapServerMockConfiguration;
  let users: LdapUser[] = [];

  try {
    serverConfiguration = require(configurationFilePath);
    users = require(databaseFilePath);
  } catch (error) {
    exit((error as Error).message);
    return;
  }

  // Load certificate's files
  let certificatePublicKey: Buffer | undefined;
  let certificatePrivateKey: Buffer | undefined;

  if (serverConfiguration.certPath && serverConfiguration.certKeyPath) {
    try {
      certificatePublicKey = await fs.readFile(path.resolve(serverConfiguration.certPath));
      certificatePrivateKey = await fs.readFile(path.resolve(serverConfiguration.certKeyPath));
    } catch (error) {
      exit((error as Error).message);
      return;
    }
  }

  const server: LdapServerMock = new LdapServerMock(users, serverConfiguration, certificatePublicKey, certificatePrivateKey);
  await server.start();
}

function printHelp(): void {
  console.log(`
usage: npx ldap-server-mock options
options:
  --conf="file"        relative or absolute path to the server configuration file
  --database="file"    relative or absolute path to the file containing LDAP users in JSON format
  `);
}

main();
