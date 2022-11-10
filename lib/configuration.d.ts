export interface LdapServerMockConfiguration {
    readonly certPath?: string;
    readonly certKeyPath?: string;
    readonly port?: number;
    readonly searchBase?: string;
}
