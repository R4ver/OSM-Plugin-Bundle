"use strict";

var brain = require('node-persist');
let regex = new RegExp( /^(\!|\/)op\s\@((\w|\d)+)\s\#((\w|\d)+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var match = regex.exec( stanza.message );
        var newOpName = match[2];
        var newOpLvl = match[4];

        console.log("the new opname is: " + newOpName);
        console.log("the new oplvl is: " + newOpLvl);

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
}]