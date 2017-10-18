# LDAP simple server mock

Really simple basic mock for [LDAP server](https://tools.ietf.org/html/rfc4511). Use it to mock an LDAP server for authenticating applications. This should not be used in production environment, it is just for test purpose, nothing more.

# Install

    npm install ldap-server-mock

# Usage

Start a fake LDAP server with the following command:

    node node_modules/ldap-server-mock/server.js --conf=/tmp/ldap-server-mock-conf.json --database=/tmp/users.json

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
  "userLoginAttribute": "cn", // The name of the LDAP attribute holding the user login (default to cn)
  "searchBase": "dc=test", // The search base used by the client to fetch user trying to connect (default to dc=test)
  "searchFilter": "(&(objectclass=person)(cn={{username}}))" // The search filter used to fetch user trying to connect with the placeholder {{username}} (default to (&(objectclass=person)(cn={{username}})))
}
```

## LDAP users

The database user must be a simple JSON file containing an array of users. Each user must have an attribute used to authenticate himself with the same name as defined by server configuration **userLoginAttribute**.
A user can also have any number of other attributes which will all be returned.

```js
[
  {
    "dn": "cn=user,dc=test", // A valid DN (Distinguished Name)
    "cn": "user-login", // The attribute corresponding to server configuration "userLoginAttribute"
    "attribute1": "value1",
    "attribute2": "value2",
    [...]
  }
]
```

# Contributors

Maintainer: [Veo-Labs](http://www.veo-labs.com/)

# License

[AGPL](http://www.gnu.org/licenses/agpl-3.0.en.html)
