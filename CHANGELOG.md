# 6.0.1 / 2022-11-10

## BUG FIXES

- Fix `npx ldap-server-mock --conf filePath --database filePath`. Binary file missed execution permission

# 6.0.0 / 2022-11-10

## BREAKING CHANGES

- Command line options `--conf` and `--database` must now respect the format `npx ldap-server-mock --conf="filePath" --database="filePath"` when something like `npx ldap-server-mock --conf filePath --database filePath` previously worked
- Filters now use the `ldapjs` filters instead of custom implementation which requires a different JSON structure in users' configuration file. Basically all user's attributes except `dn` attribute need to be under an `attributes` object. See README.md file for more information
- Running the LDAP server mock won't throw an error anymore when `searchBase` property is missing from server's configuration file. `searchBase` will default to `dc=test`

## FEATURES

- Add support for non standard LDAP over TLS (LDAPS not STARTTLS) thanks to [@ckhmer1](https://github.com/ckhmer1)
- Project has been fully rewritten in TypeScript
- Add the ability to start / stop the server programmatically

## DEPENDENCIES

- **eslint** and **eslint-plugin-node** have been replaced by [Prettier](https://prettier.io/)
- **ldapjs** has been upgraded from version 2.3.1 to **2.3.3**
- **nopt** has been upgraded from version 5.0.0 to **7.0.0**

# 5.0.0 / 2022-02-07

## BREAKING CHANGES

- Previously the returned user was the one with the value of the `userLoginAttribute` matching the value of the placeholder ̀`{{username}}` in `searchFilter` property. Other aspects of the search query were ignored. So querying a user with `(&(objectclass=person)(cn=user-login))` worked even if the user didn't have the attribute `objectclass`. So you might need to adjust attributes of the users in the database to match all aspects of the query. Also note that the server can now return several users if the query matches several users.

## FEATURES

- Add the ability to use dynamic search filter. Consequently `userLoginAttribute` and `searchFilter` properties are no longer required in server configuration file. Also AND (&), OR (|), NOT (!), and wildcard in the search filter are now supported. Note that the behavior for complex queries may be slightly different than an actual LDAP server instance. This feature is available thanks to [@stevenhair](https://github.com/stevenhair).

# 4.0.0 / 2021-11-19

## BREAKING CHANGES

- No longer tested on NodeJS &lt; 16.3.0 and NPM &lt; 7.15.1

## FEATURES

- LDAP server mock can now be launched using npx, see README.md file

## DEPENDENCIES

- **grunt** has been removed
- **grunt-cli** has been removed
- **grunt-eslint** has been removed
- **ldapjs** has been upgraded from version 1.0.2 to **2.3.1**
- **nopt** has been upgraded from version 4.0.3 to **5.0.0**

# 3.0.0 / 2020-05-04

## BREAKING CHANGES

- Using relative paths with options --conf and --database are now relative to the current directory and not relative to the module ldap-server-mock directory.
- No longer tested on NodeJS &lt; 12.4.0 and NPM &lt; 6.9.0

## DEPENDENCIES

- **asn1** has been removed, it wasn't used directly
- **ldapjs** has been upgraded from 1.0.1 to **1.0.2**
- **nopt** has been upgraded from 4.0.1 to **4.0.3**
- **grunt** has been upgraded from 1.0.1 to **1.1.0**
- **grunt-cli** has been upgraded from 1.2.0 to **1.3.2**
- **grunt-eslint** has been upgraded from 20.1.0 to **22.0.0**
- **pre-commit** sub dependencies have been upgraded

# 2.0.0 / 2018-10-16

## BREAKING CHANGES

- Drop support for NodeJS < 8.9.4 and NPM < 5.6.0

## NEW FEATURES

- Add NPM package-lock.json file

## BUG FIXES

- Fix eslint error on Server.js

# 1.0.0 / 2017-10-18

## NEW FEATURES

- Add a basic LDAP server mock to test authentication on applications using an LDAP server
