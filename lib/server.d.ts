/// <reference types="node" />
import { LdapServerMockConfiguration } from './configuration';
import { LdapServerMockLogger } from './logger';
import { LdapUser } from './user';
export declare class LdapServerMock {
    private _users;
    private _connectedSockets;
    private _port;
    private _ldapServer;
    private _logger;
    private _searchBase;
    private _server?;
    constructor(_users: LdapUser[], serverConfiguration: LdapServerMockConfiguration, certificatePublicKey?: Buffer, certificatePrivateKey?: Buffer, logger?: LdapServerMockLogger);
    start(): Promise<void>;
    stop(): Promise<void>;
}
