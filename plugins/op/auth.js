"use strict";

var runtime = require("../../utils/Runtime");

module.exports = {
    /**
     * Check if the joined user is an opped user
     * @param  {user}
     * @return {true|false}
     */
    isOpped: function(stanza) {
        var op = runtime.brain.get("chatOPS") || {};
        var opName = op[stanza];

        if ( opName !== undefined ) {
            if ( stanza === opName.oppedUser ) {
                return true;
            }
        }
    }
}