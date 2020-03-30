# 3.0.0 / YYYY-MM-DD

## BREAKING CHANGES

- Using relative paths with options --conf and --database are now relative to the current directory and not relative to the module ldap-server-mock directory.

## DEPENDENCIES

- **asn1** has been removed, it wasn't used directly
- **ldapjs** has been upgraded from 1.0.1 to **1.0.2**
- **nopt** has been upgraded from 4.0.1 to **4.0.3**

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
