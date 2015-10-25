"use strict";

/**
 * Greets an opped user when they join
 */

var brain = require('node-persist');
var auth = require("../auth");

//============================
//ohseemedias greeting
//Need this atm
const greetings = {
    "existing" : {
        "Viewer" : [
            `Back again! How's life treating you today?`,
            `Hey friend! What are you working on today?`,
        ],
        "Royalty" : [
            'The king has arrived! We appreciate your support!'
        ]
    },
    "new" : [
        'Welcome to the stream! Thanks for stopping by!'
    ]
};

var getRandomGreeting = function( availableGreetings ) {
    var length = availableGreetings.length;
    var index = Math.floor(Math.random() * length);
    return availableGreetings[ index ];
};
//============================

module.exports = [{
    types: ['presence'],
    regex: /^available$/,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.fromUsername );

        //this will be change
        let users = chat.getSetting( 'users' ) || {};
        let userObj = users[ stanza.fromUsername ];
        let existingViewer = userObj.count > 1;

        var OP = brain.getItem("chatOPS") || {};

        //Check if the user is a Modretor / owner and give custom message
        if ( auth.isModerator(user.role) ) {
            console.log(user.role);
            chat.sendMessage(`Welcome @${user.username}, my lord!`);
            return null;
        }

        //check if the user is an opped user and give custom message
        if ( auth.isOpped(stanza.fromUsername) ) {
            console.log(user.role);
            var opName = OP[stanza.fromUsername].oppedUser;
            var opLvl = OP[stanza.fromUsername].opLvl;
            chat.sendMessage(`Welcome ${opLvl}, @${opName}.`);
            return null;
        }

        let greeting;

        //this will be changed
        if ( existingViewer ) {
            // existing viewer
            greeting = getRandomGreeting( greetings[ 'existing' ] );
        } else {
            // new viewer
            greeting = getRandomGreeting( greetings[ 'new' ] );
        }

        chat.replyTo( stanza.fromUsername, greeting );
    }
}]; 