"use strict";

var brain = require('node-persist');
var say = require("winsay");
let regex = new RegExp( /^(\!|\/)rg\s(.+)$/ );

module.exports = [{
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        var user = chat.getUser( stanza.fromUsername );

        var match = regex.exec( stanza.message );
        var requestedGenre = match[2].toLowerCase();

        var genrePool = brain.getItem("genrePool") || {};

        if ( genrePool[requestedGenre] === undefined ) {

            genrePool[requestedGenre] = {
                genreName: requestedGenre,
                genreCount: 1
            };

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            brain.setItem("genrePool", genrePool);

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        } else if ( genrePool !== undefined ) {
            genrePool[requestedGenre].genreCount = genrePool[requestedGenre].genreCount + 1;

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            brain.setItem("genrePool", genrePool);

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        }

        if ( genrePool[requestedGenre].genreCount >= 5 ) {
            console.log("genre is greater than 5");
            say.speak("Victoria", "Requested genre: " + genrePool[requestedGenre].genreName);

            //Reset the requested song count
            genrePool[requestedGenre].genreCount = 0;
        }
    }
}]