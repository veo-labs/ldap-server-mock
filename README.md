# LDAP simple server mock

Really simple basic mock for [LDAP server](https://tools.ietf.org/html/rfc4511) based on [ldaps](https://github.com/ldapjs/node-ldapjs). Use it to mock an LDAP server and authenticate a user without further verifications, it simply searches for the user in the database and returns it. It does not implement LDAP SASL authentication. This should not be used in production environment, it is just for test purpose, nothing more.

# Install

    npm install ldap-server-mock

# Usage

## Using the API

`ldap-server-mock` exposes the `LdapServerMock` class:

    constructor(users: LdapUser[], serverConfiguration: LdapServerMockConfiguration, certificatePublicKey?: Buffer, certificatePrivateKey?: Buffer, logger?: LdapServerMockLogger)

| Argument              | Required | Default                              | Details                                                                           |
| --------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| users                 | yes      | -                                    | The list of LDAP users as JavaScript objects (see below)                          |
| serverConfiguration   | yes      | { port: 3004, searchBase: 'dc=test'} | The LDAP server mock configuration (see below)                                    |
| certificatePublicKey  | no       | -                                    | The public key of the certificate to use for creating an LDAP server over TLS     |
| certificatePrivateKey | no       | -                                    | The private key corresponding to the public key defined by `certificatePublicKey` |
| logger                | no       | console                              | A custom logger to use instead of `console`                                       |

    start(): Promise<void>

    stop(): Promise<void>

### Example

```js
{
import * as fs from 'node:fs/promises';
import { LdapServerMock } from 'ldap-server-mock';

async function main() {

  const ldapUsers = [
    {
      dn: 'cn=user,dc=test',
      attributes: {
        objectClass: 'person',
        cn: 'user-login',
        attribute1: 'value1',
        attribute2: 'value2'
      }
    }
  ];

  const serverConfiguration = {
    port: 3004,
    searchBase: 'dc=test'
  };

  const customLogger = {
    info: (...args) => {
      console.info(...args);
    }
  }

  const certificatePublicKey = await fs.readFile('/path/to/certificate/public/key.pem');
  const certificatePrivateKey = await fs.readFile('/path/to/certificate/private/key.pem');

  const ldapServer = new LdapServerMock(ldapUsers, serverConfiguration, certificatePublicKey, certificatePrivateKey, customLogger);
  await ldapServer.start();
  await ldapServer.stop();
}

main();
```

## Using command line

LDAP server mock can be started with command:

    npx ldap-server-mock --conf=/tmp/ldap-server-mock-conf.json --database=/tmp/users.json

With:

- **--conf** The path to a JSON file containing server's configuration (see below)
- **--database** The path to a JSON file containing the database of users (see below)

**Nb:** If process is launched as a sub process it will send a message to its parent process when started:

```js
{
  status: 'started';
}
```

### Example

    /tmp/ldap-server-mock-conf.json

The server's configuration file must be a simple JSON file:

```js
{
  "certPath": "/path/to/certificate/public/key.pem",
  "certKeyPath": "/path/to/certificate/private/key.pem",
  "port": 3004,
  "searchBase": "dc=test"
}
```

    /tmp/users.json

The database's configuration file must be a simple JSON file containing an array of users:

```js
[
  {
    dn: 'cn=user,dc=test',
    attributes: {
      objectClass: 'person',
      cn: 'user-login',
      attribute1: 'value1',
      attribute2: 'value2'
    }
  }
];
```

    npx ldap-server-mock --conf=/tmp/ldap-server-mock-conf.json --database=/tmp/users.json

# Server configuration

| Property    | Type   | Required | Default   | Details                                                                                         |
| ----------- | ------ | -------- | --------- | ----------------------------------------------------------------------------------------------- |
| certPath    | string | no       | -         | The path of the certificate's public key to use for creating an LDAP server over TLS            |
| certKeyPath | string | no       | -         | The path of the certificate's private key corresponding to the public key defined by `certPath` |
| port        | number | no       | 3004      | The port the LDAP server will listen to                                                         |
| searchBase  | string | no       | "dc=test" | The search base to use when searching for the user who is trying to connect                     |

```js
{
  certPath: '/path/to/certificate/public/key.pem',
  certKeyPath: '/path/to/certificate/private/key.pem',
  port: 3004,
  searchBase: 'dc=test'
}
```

# LDAP User

An LDAP user must have a valid Dinstinguished Name and any number of other attributes:

| Property   | Type   | Required | Default | Details                             |
| ---------- | ------ | -------- | ------- | ----------------------------------- |
| dn         | string | yes      | -       | Dinstinguish Name                   |
| attributes | Object | yes      | -       | Any key / value pairs of attributes |

```js
{
  dn: 'cn=user,dc=test",
  attributes: {
    objectClass: 'person',
    cn: 'user-login',
    attribute1: 'value1',
    attribute2: 'value2'
}
```

# Test a connection to the LDAP server

Here is an example using the `ldapsearch` client from OpenLDAP with the configuration used in examples:

    ldapsearch -x -H ldaps://127.0.0.1:3004 -b "dc=test" "(&(objectclass=person)(cn=user-login))" attribute1 attribute2

With:

- **-x** to use simple authentication without setting binding DN
- **-H ldaps://127.0.0.1:3004** the server URL
- **-b "dc=test"** the search base in LDAP directory, it should be the same as the **searchBase** property in server's configuration above
- **"(&(objectclass=person)(cn=user-login))"** the search filter
- **attribute1, attribute2** the list of attributes you want to be returned

**Nb:** Don't forget to change protocol to `ldap` if you haven't configured a certificate.

# Known issues

## STARTTLS

This mock supports running an LDAP server over TLS which is the non-standard LDAPS. However `STARTTLS` (the standard way to run an LDAP server over TLS) is not supported as the underlying [ldapjs](https://github.com/ldapjs/node-ldapjs) module has not support for it on the server side. See issue [STARTTLS support for the Server API](https://github.com/ldapjs/node-ldapjs/issues/663) for more information.

# Contributors

Maintainer: [Veo-Labs](http://www.veo-labs.com/)

# License

[AGPL](http://www.gnu.org/licenses/agpl-3.0.en.html)
