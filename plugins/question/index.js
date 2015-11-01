"use strict";

/**
 * Get question from chat and notifies MOD
 */

const Say = require('../../utils/Say');
var voice = 'Victoria';
let regex = new RegExp( /^(\!|\/)q\s(.+)$/ );

module.exports = [{
    name: '!q {question}',
    help: 'Notifies the streamer if a user has a question',
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {
        //Makes a computer voice say "question"
        Say.say("Question", voice);
    }
}];