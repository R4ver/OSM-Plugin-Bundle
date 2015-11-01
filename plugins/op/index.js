"use strict";

var runtime = require("../../utils/Runtime");
var auth = require("./auth");
var settings = require("./settings");

let createOpRegex = new RegExp( /^(\!|\/)op\s\@((\w|\d)+)\s\#((\w|\d)+)$/ );
let otherUserRank = new RegExp( /^(\!|\/)rank\s\@(\w+)$/ );

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
    regex: createOpRegex,
    action: function( chat, stanza ) {

        //Get the user
        var user = chat.getUser( stanza.user.username );

        //If the user is the streamer or has a lvl of mod they will
        //be able to op a specific user from the chat 
        if ( user.isModerator() || auth.has(user.username, "mod") ) {
            var opLevels = settings.opLevels;

            //Get the regex groups
            var match = createOpRegex.exec( stanza.message );
            var newOpName = match[2];
            var newOpLvl = match[4].toLowerCase();

            //Check if the op level specified is valid
            if ( !opLevels.hasOwnProperty(newOpLvl) ) {
                    chat.sendMessage(`Level: "${newOpLvl}" is not a valid level`);
                    return null;    
            }

            //Get the chatOPS from the brain
            var chatOPS = runtime.brain.get("chatOPS") || {};

            //Check if the opped user already exists, else create it
            if ( chatOPS[newOpName] === undefined ) {
                chatOPS[newOpName] = {
                    id: Date.now(),
                    opName: newOpName,
                    opLvl: newOpLvl
                }

                runtime.brain.set("chatOPS", chatOPS);

                chat.sendMessage(`Opped user: @${newOpName} to: ${newOpLvl}`);
            } else {

                //If the opped user already exists change the op level.
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

        //Get the chatOPS from the brain
        var OP = runtime.brain.get("chatOPS") || {};
        var opName = OP[stanza.user.username];

        //Check if the opped user exists, print the rank, else the user is a viewer
        if ( opName ) {
            chat.sendMessage(stanza.user.username + "\'s rank is " + opName.opLvl);
        } else {
            chat.sendMessage(stanza.user.username + "\'s rank is Viewer");
        }
    }
}, {
    name: '!rank {@username}',
    help: 'Gets the current op level of a user',
    types: ['message'],
    regex: otherUserRank,
    action: function( chat, stanza ) {
        //Get the chatOPS from the brain
        var OP = runtime.brain.get("chatOPS") || {};

        //Get the regex group
        var match = otherUserRank.exec( stanza.message );
        var passedUserName = match[2];

        //Set user to the user passed in by the regex group
        var user = OP[passedUserName];

        //Check if the user exists in the chat, else print "user not found"
        if ( user ) {
            chat.sendMessage(`@${user.opName}'s rank is ${user.opLvl}`);
        } else {
            chat.sendMessage(`@${passedUserName} was not found.`);
        }
    }
}]