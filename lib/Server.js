'use strict';

/**
 * Defines an LDAP Server.
 */

const ldap = require('ldapjs');
const controller = process.require('lib/controller.js');
const conf = process.require('lib/conf.js');

class Server {

  /**
   * Creates a new LDAP server.
   *
   * @class Server
   * @constructor
   * @param {Number} port The port to listen to
   */
  constructor(port, cert, certKey) {

    Object.defineProperties(this, {

      /**
       * LDAP application server.
       *
       * @property app
       * @type Object
       */
      app: {
        value: ldap.createServer(
          {
            certificate: cert,
            key: certKey
          }
        )
      },

      /**
       * Server port.
       *
       * @property port
       * @type Number
       */
      port: {
        value: port
      }

    });

    this.mountRoutes();
  }

  /**
   * Mounts LDAP server routes.
   *
   * @method mountRoutes
   */
  mountRoutes() {
    this.app.bind(conf.server.searchBase, controller.bindAction);
    this.app.search(conf.server.searchBase, controller.searchAction);
  }

  /**
   * Starts the server.
   *
   * @method start
   */
  start() {
    this.app.listen(this.port, () => {
      process.stdout.write(`LDAP server listening on port ${this.port}\n`);

      // If process is a child process, send an event to parent process informing that the server has started
      if (process.connected)
        process.send({status: 'started'});
    });
  }

}

module.exports = Server;
