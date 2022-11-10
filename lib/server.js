"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LdapServerMock = void 0;
const ldapjs_1 = require("ldapjs");
const logger_1 = require("./logger");
class LdapServerMock {
    constructor(_users, serverConfiguration, certificatePublicKey, certificatePrivateKey, logger) {
        this._users = _users;
        this._connectedSockets = new Set();
        this._port = serverConfiguration.port ?? 3004;
        this._searchBase = serverConfiguration.searchBase ?? 'dc=test';
        this._ldapServer = (0, ldapjs_1.createServer)({
            ...(certificatePublicKey && { certificate: certificatePublicKey }),
            ...(certificatePrivateKey && { key: certificatePrivateKey })
        });
        this._logger = logger ?? new logger_1.LdapServerMockLogger();
    }
    async start() {
        return new Promise((resolve, reject) => {
            this._ldapServer.bind(this._searchBase, (request, response, next) => {
                response.end();
            });
            this._ldapServer.search(this._searchBase, (request, response, next) => {
                for (const user of this._users) {
                    if (request.filter.matches(user.attributes)) {
                        response.send(user);
                    }
                }
                response.end();
            });
            this._logger.info('starting');
            this._server = this._ldapServer.listen(this._port, () => {
                const info = this._server?.address();
                this._logger.info('started on port %i', info.port);
                if (process.connected && process.send) {
                    process.send({ status: 'started' });
                }
                resolve();
            });
            this._server.on('connection', (socket) => {
                this._connectedSockets.add(socket);
                socket.on('close', () => {
                    this._connectedSockets.delete(socket);
                });
            });
        });
    }
    async stop() {
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
            }
            else {
                resolve();
            }
        });
    }
}
exports.LdapServerMock = LdapServerMock;
