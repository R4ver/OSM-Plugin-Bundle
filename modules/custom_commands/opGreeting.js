"use strict";

/**
 * Greets an opped user when they join
 */

var brain = require('node-persist');
var auth = require("../auth");

module.exports = [{
    types: ['presence'],
    regex: /^available$/,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.fromUsername );
        var OP = brain.getItem("chatOPS") || {};

        console.log("Greeting role is: " + stanza.fromUsername.role);

        //Check if the user is a Modretor / owner and give custom message
        if ( auth.isModerator(user.role) ) {
            console.log(user.role);
            chat.sendMessage(`Welcome @${user.username}, my lord!`);
            return null;
        }

        //check if the user is an opped user and give custom message
        if ( auth.isOpped(stanza.fromUsername) ) {
            var opName = OP[stanza.fromUsername].oppedUser;
            var opLvl = OP[stanza.fromUsername].opLvl;
            chat.sendMessage(`Welcome ${opLvl}, @${opName}.`);
            return null;
        }
    }
}]; 