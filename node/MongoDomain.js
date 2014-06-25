(function () {

    'use strict';

    var MongoClient = require('mongodb').MongoClient;

    console.log('MongoDomain MongoClient: %o', MongoClient);

    var MongoDB = {

        connect: function (url, errback) {

            MongoClient.connect(url, function (err, db) {

                if (err) return errback(err, null);

                var collection = db.collection('users');

                collection.find().toArray(function (err, items) {

                    if (err) return errback(err), null;

                    errback(null, items);
                });
            });
        },

        close: function (errback) {

            MongoClient.close(errback);
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
                    name: 'url',
                    type: 'string',
                    description: 'The mongoDB url'
                }
            ],
            // return values
            [
                {
                    name: 'users',
                    type: 'Array',
                    description: 'The users'
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
