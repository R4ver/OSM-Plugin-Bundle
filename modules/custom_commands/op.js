"use strict";

var brain = require('node-persist');
var auth = require("../auth");
let regex = new RegExp( /^(\!|\/)op\s\@((\w|\d)+)\s\#((\w|\d)+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var user = chat.getUser( stanza.fromUsername );

        if ( auth.isModerator(user.role) ) {
            var match = regex.exec( stanza.message );
            var newOpName = match[2];
            var newOpLvl = match[4];

            //Get the OPS
            var chatOPS = brain.getItem("chatOPS") || {};

            if ( chatOPS[newOpName] === undefined ) {
                chatOPS[newOpName] = {
                    id: Date.now(),
                    oppedUser: newOpName,
                    opLvl: newOpLvl
                }

                brain.setItem("chatOPS", chatOPS);

                chat.sendMessage(`Opped user: @${newOpName} to: ${newOpLvl}`);
            } else {
                chat.sendMessage("User already opped");
            }
        }

    }
}]