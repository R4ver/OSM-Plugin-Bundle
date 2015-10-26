"use strict";

var runtime = require("../../utils/Runtime");
var settings = require("./settings");

module.exports = {
    /**
     * Check if the joined user is an opped user
     * @param  {user}
     * @return {true|false}
     */
    isOpped: function(stanza) {
        var OP = runtime.brain.get("chatOPS") || {};
        var opName = OP[stanza];

        if ( opName !== undefined ) {
            if ( stanza === opName.oppedUser ) {
                return true;
            }
        }
    },

    has: function(stanza, lvl) {
        var OP = runtime.brain.get("chatOPS") || {};
        var userLvl = OP[stanza].opLvl.toLowerCase();
        var userWeight = settings.opLevels[userLvl].weight;
        var opWeight = settings.opLevels[lvl].weight;

        if ( userWeight >= opWeight ) {
            return true;
        }
    }
}