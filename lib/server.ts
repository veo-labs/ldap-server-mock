import { Server } from 'node:http';
import { AddressInfo, Socket } from 'node:net';
import { createServer, Server as LdapServer } from 'ldapjs';

import { LdapServerMockConfiguration } from './configuration';
import { LdapBindRequest, LdapBindResponse, LdapNext, LdapSearchRequest, LdapSearchResponse } from './ldapTypes';
import { LdapServerMockLogger } from './logger';
import { LdapUser } from './user';

export class LdapServerMock {
  private _connectedSockets = new Set<Socket>();
  private _port: number;
  private _ldapServer: LdapServer;
  private _logger: LdapServerMockLogger;
  private _searchBase: string;
  private _server?: Server;

  constructor(
    private _users: LdapUser[],
    serverConfiguration: LdapServerMockConfiguration,
    certificatePublicKey?: Buffer,
    certificatePrivateKey?: Buffer,
    logger?: LdapServerMockLogger
  ) {
    this._port = serverConfiguration.port ?? 3004;
    this._searchBase = serverConfiguration.searchBase ?? 'dc=test';
    this._ldapServer = createServer({
      ...(certificatePublicKey && { certificate: certificatePublicKey }),
      ...(certificatePrivateKey && { key: certificatePrivateKey })
    });
    this._logger = logger ?? new LdapServerMockLogger();
  }

  /**
   * Starts the server.
   *
   * @return Promise resolving when the server has started
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ldapServer.bind(this._searchBase, (request: LdapBindRequest, response: LdapBindResponse, next: LdapNext) => {
        response.end();
      });

      this._ldapServer.search(this._searchBase, (request: LdapSearchRequest, response: LdapSearchResponse, next: LdapNext) => {
        for (const user of this._users) {
          if (request.filter.matches(user.attributes)) {
            response.send(user);
          }
        }

        response.end();
      });

      this._logger.info('starting');
      this._server = this._ldapServer.listen(this._port, () => {
        const info: AddressInfo = this._server?.address() as AddressInfo;
        this._logger.info('started on port %i', info.port);

        // If process is a child process, send an event to parent process informing that the server has started
        if (process.connected && process.send) {
          process.send({ status: 'started' });
        }

        resolve();
      }) as unknown as Server;

      this._server.on('connection', (socket: Socket) => {
        this._connectedSockets.add(socket);

        socket.on('close', () => {
          this._connectedSockets.delete(socket);
        });
      });
    });
  }

  /**
   * Stops the server.
   *
   * @return Promise resolving when the server has stopped
   */
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._logger.info('stopping');
      if (this._server) {
        for (const socket of this._connectedSockets.values()) {
          socket.destroy();
        }

        this._server.close(() => {
          this._logger.info('stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
