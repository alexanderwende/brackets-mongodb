define(function (require, exports, module) {

    'use strict';

    var PanelManager = brackets.getModule('view/PanelManager'),
        CommandManager = brackets.getModule('command/CommandManager'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        Menus = brackets.getModule('command/Menus'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
		AppInit = brackets.getModule('utils/AppInit');

    var COMMAND_ID = 'alexanderwende.mongodb';

    var mongoPanel, mongoPanelHTML = require('text!template/mongoPanel.html');

    var preferences = PreferencesManager.getExtensionPrefs('alexanderwende.mongodb');

    preferences.definePreference('enabled', 'boolean', false);
    preferences.definePreference('host', 'string', 'localhost');
    preferences.definePreference('port', 'number', 27017);
    preferences.definePreference('db', 'string', 'test');

    var mongoDomain = new NodeDomain('alexanderwende.mongodb', ExtensionUtils.getModulePath(module, 'node/MongoDomain'));


    function mongoConnect () {

        mongoDomain.exec('connect', preferences.get('host'), preferences.get('port'), preferences.get('db'))
            .done(function (info) {
                console.log('[brackets-mongodb] connect collections: %o', info);
            })
            .fail(function (error) {
                console.log('[brackets-mongodb] connect error: %o', error);
            });
    }

    function mongoClose () {

        mongoDomain.exec('close')
            .done(function () {
                console.log('[brackets-mongodb] close');
            })
            .fail(function (error) {
                console.log('[brackets-mongodb] close error: %o', error);
            });
    }



    function toggleMongoDB () {

        enableMongoDB(!preferences.get('enabled'));
    }



    function enableMongoDB (enable) {

        if (enable) {
            console.log("mongoDB show");
            mongoPanel.show();
            mongoConnect();
        } else {
            console.log("mongoDB hide");
            mongoPanel.hide();
            mongoClose();
        }

        preferences.set('enabled', enable);
        preferences.save();

        CommandManager.get(COMMAND_ID).setChecked(enable);
    }



    AppInit.appReady(function () {

        ExtensionUtils.loadStyleSheet(module, 'style.css');

        CommandManager.register('MongoDB', COMMAND_ID, toggleMongoDB);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

        if (menu !== undefined) {
            menu.addMenuDivider();
            menu.addMenuItem(COMMAND_ID, 'Ctrl-Alt-M');
        }

        mongoPanel = PanelManager.createBottomPanel('alexanderwende.mongodb.panel', $(mongoPanelHTML), 200);

        if (preferences.get('enabled')) { enableMongoDB(true); }
    });
});
