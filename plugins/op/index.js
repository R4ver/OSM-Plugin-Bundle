"use strict";

var runtime = require("../../utils/Runtime");
var auth = require("./auth");
var settings = require("./settings");
let regex = new RegExp( /^(\!|\/)op\s\@((\w|\d)+)\s\#((\w|\d)+)$/ );

module.exports = [{
    types: ['presence'],
    regex: /^available$/,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.user.username );
        var OP = runtime.brain.get("chatOPS") || {};

        //Check if the user is a Modretor / owner and give custom message
        if ( user.isModerator() ) {
            //Get the custom greeting for the streamer from the settings file
            var cm = settings.greetings.streamer;
            var streamerMessage = cm.replace("{{username}}", stanza.user.username);

            chat.sendMessage(`${streamerMessage}`);
            return null;
        }

        //check if the user is an opped user and give custom message
        if ( auth.isOpped(user.username) ) {
            //Get the name and lvl from the brain
            var opName = OP[user.username].oppedUser;
            var opLvl = OP[user.username].opLvl;

            //Get the custom greeting for the opped viewer from the settings file
            var cm = settings.greetings.oppedUser;
            var opMessage = cm.replace("{{opLvl}}", opLvl).replace("{{opName}}", opName);

            chat.sendMessage(`${opMessage}`);
            return null;
        }

        let existingViewer = stanza.user.viewCount > 1;

        if ( existingViewer ) { //User has been on the stream before
            //Get the custom greeting for the returning viewer from the settings file
            var cm = settings.greetings.existingViewer;
            var existingViewerMessage = cm.replace("{{username}}", stanza.user.username);

            chat.sendMessage(`${existingViewerMessage}`);
        } else { //The user has never been on the stream
            //Get the custom greeting for the new viewer from the settings file
            var cm = settings.greetings.newViewer;
            var newViewerMessage = cm.replace("{{username}}", stanza.user.username);

            chat.sendMessage(`${newViewerMessage}`);
        }
    }
}, {
    name: '!op {@username} {#Lvl}',
    help: 'Ops an user to a specific level',
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var user = chat.getUser( stanza.user.username );

        if ( user.isModerator() || auth.has(user.username, "mod") ) {
            var opLevels = settings.opLevels;


            var match = regex.exec( stanza.message );
            var newOpName = match[2];
            var newOpLvl = match[4].toLowerCase();

            if ( !opLevels.hasOwnProperty(newOpLvl) ) {
                    chat.sendMessage(`Level: "${newOpLvl}" is not a valid level`);
                    return null;    
            }
            //Get the OPS
            var chatOPS = runtime.brain.get("chatOPS") || {};

            if ( chatOPS[newOpName] === undefined ) {
                chatOPS[newOpName] = {
                    id: Date.now(),
                    oppedUser: newOpName,
                    opLvl: newOpLvl
                }

                runtime.brain.set("chatOPS", chatOPS);

                chat.sendMessage(`Opped user: @${newOpName} to: ${newOpLvl}`);
            } else {
                var match = regex.exec( stanza.message );
                var existingOpName = match[2];
                var newOpLvl = match[4];

                chatOPS[existingOpName].opLvl = newOpLvl;

                runtime.brain.set("chatOPS", chatOPS);

                chat.sendMessage(`Opped user: @${existingOpName} to: ${newOpLvl}`);
            }
        }

    }
}, {
    name: '!rank',
    help: 'Gets the current op level of the user',
    types: ['message'],
    regex: /^(\!|\/)rank$/,
    action: function( chat, stanza ) {
        var OP = runtime.brain.get("chatOPS") || {};
        var opName = OP[stanza.user.username];

        if ( opName !== undefined ) {
            chat.sendMessage(stanza.user.username + "\'s rank is " + opName.opLvl);
        } else {
            chat.sendMessage(stanza.user.username + "\'s rank is Viewer");
        }
    }
}]