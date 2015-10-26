"use strict";

var runtime = require("../../utils/Runtime");
var auth = require("./auth");
let regex = new RegExp( /^(\!|\/)op\s\@((\w|\d)+)\s\#((\w|\d)+)$/ );

module.exports = [{
    types: ['presence'],
    regex: /^available$/,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.user.username );
        var OP = runtime.brain.get("chatOPS") || {};

        //Check if the user is a Modretor / owner and give custom message
        console.log("OPGREETING PRESENCE");
        if ( user.isModerator() ) {
            chat.sendMessage(`Welcome @${user.username}, my lord!`);
            return null;
        }

        //check if the user is an opped user and give custom message
        console.log(user.username);
        if ( auth.isOpped(user.username) ) {
            var opName = OP[user.username].oppedUser;
            var opLvl = OP[user.username].opLvl;
            chat.sendMessage(`Welcome ${opLvl}, @${opName}.`);
            return null;
        }
    }
}, {
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var user = chat.getUser( stanza.user.username );

        console.log("OP COMMAND");
        if ( user.isModerator() ) {
            var match = regex.exec( stanza.message );
            var newOpName = match[2];
            var newOpLvl = match[4];

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
                chat.sendMessage("User already opped");
            }
        }

    }
}, {
    types: ['message'],
    regex: /^(\!|\/)rank$/,
    help: 'Returns the OP level of the user',
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