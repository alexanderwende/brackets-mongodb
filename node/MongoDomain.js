(function () {

    'use strict';

    var MongoClient = require('mongodb').MongoClient,
        Server      = require('mongodb').Server,
        Db          = require('mongodb').Db;



    var MongoDB = {

        mongoClient: null,

        db: null,

        connect: function (host, port, db, errback) {

            if (this.mongoClient) this.mongoClient.close();

            this.mongoClient = new MongoClient(new Server(host, port), {native_parser: true});

            this.mongoClient.open(function (err, mongoClient) {

                if (err) return errback(err, null);

                MongoDB.db = mongoClient.db(db);

                MongoDB.db.collectionsInfo().toArray(function (err, info) {

                    if (err) return errback(err, null);

                    errback(null, info);
                });
            });
        },

        close: function (errback) {

            if (this.mongoClient) {
                this.mongoClient.close(errback);
            }
            else {
                errback(null, null);
            }
        }
    };

    function init (domainManager) {

        if (!domainManager.hasDomain('alexanderwende.mongodb')) {
            domainManager.registerDomain('alexanderwende.mongodb', {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            'alexanderwende.mongodb',
            'connect',
            MongoDB.connect,
            true,
            'Creates a connection to a mongoDB instance.',
            // input parameters
            [
                {
                    name: 'host',
                    type: 'string',
                    description: 'The mongoDB host'
                },
                {
                    name: 'port',
                    type: 'number',
                    description: 'The mongoDB port'
                },
                {
                    name: 'db',
                    type: 'string',
                    description: 'The mongoDB database'
                }
            ],
            // return values
            [
                {
                    name: 'collectionsInfo',
                    type: 'Array',
                    description: 'The collections information for the current database'
                }
            ]
        );

        domainManager.registerCommand(
            'alexanderwende.mongodb',
            'close',
            MongoDB.close,
            true,
            'Closes a connection to a mongoDB instance.',
            // input parameters
            [],
            // return values
            []
        );
    }

    exports.init = init;

}());
