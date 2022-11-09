import { Socket } from 'node:net';
import { DN, Filter } from 'ldapjs';

/**
 * Current LDAP state.
 */
export interface LdapState {
  // The DN the connected user binded with
  readonly bindDN: DN;
}

/**
 * Base interface for all LDAP requests.
 */
export interface LdapRequest {
  // NodeJS socket associated to the request along with the LDAP state
  readonly connection: Socket & LdapState;

  // Point in the tree the operation wants to operate on
  readonly dn: DN;

  // Unique id of the request
  readonly logId: string;
}

/**
 * Base interface for all LDAP responses.
 */
export interface LdapResponse {
  readonly end: (code?: number) => void;
}

/**
 * LDAP bind request.
 */
export interface LdapBindRequest extends LdapRequest {
  // The method of authentication (ldapjs only supports simple)
  readonly authentication: string;

  // Plain text password as only simple authentication is implemented in ldapjs
  readonly credentials: string;

  // The DN the client is attempting to bind as (same as dn)
  readonly name: DN;

  // The LDAP protocol version the client is requested to run this connection on (ldapjs only support version 3)
  readonly version: string;
}

/**
 * LDAP search request.
 */
export interface LdapSearchRequest extends LdapRequest {
  // The list of attributes to restrict the returned result sets to
  readonly attributes: string[];

  // The DN the client is attempting to start search at (same as dn)
  readonly baseObject: DN;

  // The filter
  readonly filter: Filter;

  // The DN the client is attempting to start search at (same as dn)
  readonly scope: 'base' | 'one' | 'sub';

  // The number of entries to return (default to 0 = unlimited)
  readonly sizeLimit: number;

  // The maximum amount of time the server should take to send search entries
  readonly timeLimit: number;

  // Whether to return only the names of attributes and not values
  readonly typesOnly: boolean;
}

/**
 * LDAP bind response.
 */
export interface LdapBindResponse extends LdapResponse {}

/**
 * LDAP search response.
 */
export interface LdapSearchResponse extends LdapResponse {
  readonly send: (entry: any) => void;
}

/**
 * LDAP next function to call next route.
 */
export type LdapNext = (error?: Error) => void;
