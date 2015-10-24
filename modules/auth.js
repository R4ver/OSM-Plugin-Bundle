"use strict";

var brain = require('node-persist');

module.exports = {

    /**
     * Check if the joined user is a moderator / owner
     * @param  {user role}
     * @return {true|false}
     */
    isModerator: function(stanza) {
        console.log("auth.js says: " + stanza);
        if ( stanza === "moderator" ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Check if the joined user is an opped user
     * @param  {user}
     * @return {true|false}
     */
    isOpped: function(stanza) {
        var op = brain.getItem("chatOPS") || {};
        var opName = op[stanza];

        if ( opName !== undefined ) {
            if ( stanza === opName.oppedUser ) {
                return true;
            } else {
                console.log("Is not opped");
                return false;
            }
        }
    }
}