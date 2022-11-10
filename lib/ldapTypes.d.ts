/// <reference types="node" />
import { Socket } from 'node:net';
import { DN, Filter } from 'ldapjs';
export interface LdapState {
    readonly bindDN: DN;
}
export interface LdapRequest {
    readonly connection: Socket & LdapState;
    readonly dn: DN;
    readonly logId: string;
}
export interface LdapResponse {
    readonly end: (code?: number) => void;
}
export interface LdapBindRequest extends LdapRequest {
    readonly authentication: string;
    readonly credentials: string;
    readonly name: DN;
    readonly version: string;
}
export interface LdapSearchRequest extends LdapRequest {
    readonly attributes: string[];
    readonly baseObject: DN;
    readonly filter: Filter;
    readonly scope: 'base' | 'one' | 'sub';
    readonly sizeLimit: number;
    readonly timeLimit: number;
    readonly typesOnly: boolean;
}
export interface LdapBindResponse extends LdapResponse {
}
export interface LdapSearchResponse extends LdapResponse {
    readonly send: (entry: any) => void;
}
export declare type LdapNext = (error?: Error) => void;
