var brain = require('node-persist');

module.exports = [{
    types: ['message'],
    regex: /^(\!|\/)rank$/,
    action: function( chat, stanza ) {
        var op = brain.getItem("chatOPS") || {};
        var opName = op[stanza.fromUsername];

        if ( opName !== undefined ) {
            chat.sendMessage(stanza.fromUsername + "\'s rank is " + opName.opLvl);
        } else {
            chat.sendMessage(stanza.fromUsername + "\'s rank is Viewer");
        }
    }
}];