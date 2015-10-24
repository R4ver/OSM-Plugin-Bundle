'use strict';

var brain = require('node-persist');
var auth = require("../modules/auth");
/**
 * Greets a viewer when they join the stream.
 * There is a different message displayed for new viewers vs. previous viewers.
 */
module.exports = [{
    types: ['presence'],
    regex: /^available$/,
    action: function( chat, stanza ) {
        let leaderboard = chat.getSetting( 'leaderboard' ) || {};
        let userObj = leaderboard[ stanza.fromUsername ];

        if ( userObj && userObj.count > 1 ) {
            // Existing viewer
            chat.sendMessage( `Back again @${stanza.fromUsername}? How\'s life treating you today?` );
        } else {
            // New viewer
            chat.replyTo( stanza.fromUsername, 'Welcome to the stream! Thanks for stopping by!' );
        }
    }
}];
