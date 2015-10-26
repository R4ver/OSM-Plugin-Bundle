"use strict";

/**
 * Get question from chat and notifies MOD
 */

const Say = require('../../utils/Say');
var voice = 'Victoria';
let regex = new RegExp( /^(\!|\/)q\s(.+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {
        Say.say("Question", voice);
    }
}];