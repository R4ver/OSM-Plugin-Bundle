"use strict";

var brain = require('node-persist');

module.exports = {
    isModerator: function(stanza) {
        if ( stanza === "moderator" ) {
            return true;
        } else {
            return false;
        } 
    },

    isOpped: function(stanza) {
        var op = brain.getItem("chatOPS") || {};
        var opName = op[stanza];

        console.log(opName);

        if ( opName !== undefined ) {
            console.log("Is not Undefined");
            if ( stanza === opName.oppedUser ) {
                console.log("Is opped");
                return true;
            } else {
                console.log("Is not opped");
                return false;
            }
        }
    }
}