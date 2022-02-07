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
  "port": 3004, // The port the server will listen to (default to 3004)
  "searchBase": "dc=test" // The search base used by the client to fetch user trying to connect (default to dc=test)
}
```

## LDAP users

The database user must be a simple JSON file containing an array of users. The user must have a valid distinguished name (dn).
A user can also have any number of other attributes which will all be returned.

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

Here is an example using the ldapsearch client from OpenLDAP with the configuration above:

    ldapsearch -x -H ldap://127.0.0.1:3004 -b "dc=test" "(&(objectclass=person)(cn=user-login))" attribute1 attribute2

With:
 - **-x** to deactivate authentication to the LDAP server
 - **-H ldap://127.0.0.1:3004** the server URL
 - **-b "dc=test"** the search base in LDAP directory, it should be the same as the **searchBase** property in server configuration above
 - **"(&(objectclass=person)(cn=user-login))"** the search filter
 - **attribute1, attribute2** the list of attributes you want to be returned

# Contributors

Maintainer: [Veo-Labs](http://www.veo-labs.com/)

# License

[AGPL](http://www.gnu.org/licenses/agpl-3.0.en.html)
