"use strict";

/**
 * Get question from chat and notifies MOD
 */

var say = require('winsay');
var voice = 'Victoria';
let regex = new RegExp( /^(\!|\/)q\s(.+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {
        say.speak(voice, "Question");
    }
}];