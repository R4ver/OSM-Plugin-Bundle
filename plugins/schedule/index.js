//!add schedule <Tittle> <time>
"use strict";

/**
 * Gets or sets the schedule for a stream
 */

var runtime = require("../../utils/Runtime");
var auth = require("../op/auth");
let getScheduleRegex = new RegExp( /^(\!|\/)schedule$/ );
let addScheduleRegex = new RegExp( /^(!|\/)schedule-add\s(\w+)\s(\d+.+\d+)\s(\w+)$/ );

module.exports = [{
    types: ['message'],
    regex: getScheduleRegex,
    action: function( chat, stanza ) {
        var schedule = runtime.brain.get("schedule");

        if ( schedule ) {
            for ( var key in schedule ) {
                var item = schedule[key];

                var listSchedule = `
                    \n
                    Stream Schedule:
                    \n\n
                    ${item.title} at ${item.time} on the ${item.date}
                `;
            }

            //chat.sendMessage("\nStream schedule: \n\n" + scheduleName.title + " at " + scheduleName.time + " on " + scheduleName.date);
        } else {
            console.log("Went to the else statement");
            //chat.sendMessage("\nStream schedule: \n\nNo schedule");
        }
    }
}, {
    types: ['message'],
    regex: addScheduleRegex,
    action: function( chat, stanza ) {
        var user = chat.getUser( stanza.user.username );

        if ( user.isModerator() ) {
            var match = addScheduleRegex.exec( stanza.message );
            var newScheduleTitle = match[2];
            var newScheduleTime = match[3];
            var newScheduleDate = match[4];

            //Get the OPS
            var schedule = runtime.brain.get("schedule") || {};

            if ( schedule[newScheduleTitle] === undefined ) {
                schedule[newScheduleTitle] = {
                    id: Date.now(),
                    title: newScheduleTitle,
                    time: newScheduleTime,
                    date: newScheduleDate
                }

                runtime.brain.set("schedule", schedule);

                chat.sendMessage(`Added schedule: ${newScheduleTitle}`);
            } else {
                chat.sendMessage("Schedule already added");
            }
        }
    }
}];