"use strict";


let runtime = require("../../utils/Runtime");
var say = require("winsay");
var auth = require("../op/auth");
let regex = new RegExp( /^(\!|\/)rg\s(.+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var user = chat.getUser( stanza.user.username );
        var chatOPS = runtime.brain.get("chatOPS") || {};
        var opName = chatOPS[user.username];

        if ( ! auth.has(user.username, "donator") ) {
            return false;
        } 

        var match = regex.exec( stanza.message );
        var requestedGenre = match[2].toLowerCase();

        var genrePool = runtime.brain.get( 'genrePool' ) || {};

        if ( genrePool[requestedGenre] === undefined ) {
            console.log("Trying to create pool");
            genrePool[requestedGenre] = {
                genreName: requestedGenre,
                genreCount: 1
            };

            console.log("Made pool item");

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            runtime.brain.set("genrePool", genrePool);

            console.log("The pool item is set");

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        } else if ( genrePool !== undefined ) {
            genrePool[requestedGenre].genreCount = genrePool[requestedGenre].genreCount + 1;

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            runtime.brain.set("genrePool", genrePool);

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        }

        if ( genrePool[requestedGenre].genreCount >= 5 ) {
            console.log("genre is greater than 5");

            say.speak("Victoria", "Requested genre: " + genrePool[requestedGenre].genreName);

            //Reset the requested song count
            genrePool[requestedGenre].genreCount = 0;
            runtime.brain.set("genrePool", genrePool);
        }
    }
}]