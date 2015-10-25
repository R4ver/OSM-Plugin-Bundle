//!add schedule <Tittle> <time>
"use strict";

/**
 * Gets or sets the schedule for a stream
 */

var brain = require('node-persist');
var auth = require("../auth");
let getScheduleRegex = new RegExp( /^(\!|\/)schedule$/ );
let addScheduleRegex = new RegExp( /^(!|\/)schedule\sadd\s(.+)\s(\w+)\s(\w+)$/ );

module.exports = [{
    types: ['message'],
    regex: getScheduleRegex,
    action: function( chat, stanza ) {
        var schedule = brain.getItem("schdedule") || {};
        var scheduleName = schedule[ stanza.fromUsername ];

        if ( scheduleName !== undefined ) {
            chat.sendMessage("\nStream schedule: \n\n" + scheduleName.title + " at " + scheduleName.time + " on " + scheduleName.date);
        } else {
            chat.sendMessage("\nStream schedule: \n\nNo schedule");
        }
    }
}, {
    types: ['message'],
    regex: addScheduleRegex,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.fromUsername );

        if ( auth.isModerator(user.role) ) {
            var match = addScheduleRegex.exec( stanza.message );
            var newScheduleTitle = match[2];
            var newScheduleTime = match[3];
            var newScheduleDate = match[4];

            //Get the OPS
            var schedule = brain.getItem("schdedule") || {};
            var scheduleName = schedule[ stanza.fromUsername ];

            if ( schedule[newScheduleTitle] === undefined ) {

                schedule[newScheduleTitle] = {
                    id: Date.now(),
                    title: newScheduleTitle,
                    time: newScheduleTime,
                    date: newScheduleDate
                }

                brain.setItem("schedule", schedule);

                chat.sendMessage(`Added schedule: ${newScheduleTitle}`);
            } else {
                chat.sendMessage("Schedule already added");
            }
        }
    }
}];