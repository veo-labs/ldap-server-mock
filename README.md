# LDAP simple server mock

Really simple basic mock for [LDAP server](https://tools.ietf.org/html/rfc4511). Use it to mock an LDAP server and authenticate a user without further verifications, it simply searches for the user in the database and returns it. It does not implement LDAP SASL authentication. This should not be used in production environment, it is just for test purpose, nothing more.

# Install

    npm install ldap-server-mock

# Usage

Start a fake LDAP server with the following command:

    npx ldap-server-mock --conf=/tmp/ldap-server-mock-conf.json --database=/tmp/users.json

With:

- **--conf** The path to the JSON file containing server configuration (see below)
- **--database** The path to the JSON file containing the database of users (see below)

**Nb:** If process is launched as a sub process it will send a message to its parent process when starting:

```js
{status: 'started'}
```

## Server configuration

The server configuration must be a simple JSON file.

```js
{

  // Optional property to set the certificate's public key to run LDAP server over TLS (LDAPS)
  "certPath": "/path/to/certificate/public/key.pem",

  // Optional property to set the certificate's private key if certPath is specified
  "certKeyPath": "/path/to/certificate/private/key.pem",

  // The port the server will listen to (default to 3004)
  "port": 3004,

  // The search base used by the client to fetch user trying to connect (default to dc=test)
  "searchBase": "dc=test"

}
```

## LDAP users

The database configuration file must be a simple JSON file containing an array of users. The user must have a valid distinguished name (dn).
A user can also have any number of other attributes.

```js
[
  {
    "dn": "cn=user,dc=test", // A valid DN (Distinguished Name)
    "objectClass": "person",
    "cn": "user-login",
    "attribute1": "value1",
    "attribute2": "value2",
    [...]
  }
]
```

## Test a connection to the LDAP server

Here is an example using the `ldapsearch` client from OpenLDAP with the configuration above (without certificate):

    ldapsearch -x -H ldap://127.0.0.1:3004 -b "dc=test" "(&(objectclass=person)(cn=user-login))" attribute1 attribute2

With:
 - **-x** to deactivate authentication to the LDAP server
 - **-H ldap://127.0.0.1:3004** the server URL
 - **-b "dc=test"** the search base in LDAP directory, it should be the same as the **searchBase** property in server configuration above
 - **"(&(objectclass=person)(cn=user-login))"** the search filter
 - **attribute1, attribute2** the list of attributes you want to be returned

## Known issues

### STARTTLS

This mock supports running an LDAP server over TLS which is the non-standard LDAPS. However `STARTTLS` (the standard way to run an LDAP server over TLS) is not supported as the underlying [ldapjs](https://github.com/ldapjs/node-ldapjs) module has not support for it on the server side. See issue [STARTTLS support for the Server API](https://github.com/ldapjs/node-ldapjs/issues/663) for more information.

# Contributors

Maintainer: [Veo-Labs](http://www.veo-labs.com/)

# License

[AGPL](http://www.gnu.org/licenses/agpl-3.0.en.html)
