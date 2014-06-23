define(function (require, exports, module) {

    'use strict';

    var PanelManager = brackets.getModule('view/PanelManager'),
        CommandManager = brackets.getModule('command/CommandManager'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        Menus = brackets.getModule('command/Menus'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
		AppInit = brackets.getModule('utils/AppInit');

    var COMMAND_ID = 'alexanderwende.mongodb';

    var mongoPanel, mongoPanelHTML = require('text!template/mongoPanel.html');

    var preferences = PreferencesManager.getExtensionPrefs('alexanderwende.mongodb');

    preferences.definePreference('enabled', 'boolean', false);



    function toggleMongoDB () {

        enableMongoDB(!preferences.get('enabled'));
    }



    function enableMongoDB (enable) {

        if (enable) {
            console.log("mongoDB show");
            mongoPanel.show();
        } else {
            console.log("mongoDB hide");
            mongoPanel.hide();
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