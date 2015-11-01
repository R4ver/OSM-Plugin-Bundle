//!add schedule <Tittle> <time>
"use strict";

/**
 * Gets or sets the schedule for a stream
 */

var runtime = require("../../utils/Runtime");
var auth = require("../op/auth");
let getScheduleRegex = new RegExp( /^(\!|\/)schedule$/ );
let addScheduleRegex = new RegExp( /^(!|\/)schedule-add\s@(.+)\s\#(\d+.+\d+)\s\#(.+)$/ );
let deleteScheduleRegex = new RegExp( /^(!|\/)schedule-del\s#(\d+)\s\@(.+)$/ );

module.exports = [{
    types: ['message'],
    regex: getScheduleRegex,
    action: function( chat, stanza ) {
        var schedule = runtime.brain.get("schedule");
        var output = `\nStream schedule:\n\n`;

        //If there's a schedule, print the schedule
        if ( schedule ) {
            for ( var key in schedule ) {
                var item = schedule[key];

                output += `${item.title} at ${item.time} on the ${item.date}\n `;
            }

            chat.sendMessage(output);
        } else {

            //Else no schedule was found
            console.log("Went to the else statement");
            chat.sendMessage("\nStream schedule:\n\nNo schedule");
        }
    }
}, {
    types: ['message'],
    regex: addScheduleRegex,
    action: function( chat, stanza ) {

        //Get the user who typed the command
        var user = chat.getUser( stanza.user.username );

        //If that user is a streamer they can continue
        if ( user.isModerator() ) {

            //Get the regex groups
            var match = addScheduleRegex.exec( stanza.message );
            var newScheduleTitle = match[2];
            var newScheduleTime = match[3];
            var newScheduleDate = match[4];

            //Get the schedule from the brain
            var schedule = runtime.brain.get("schedule") || {};

            //If the schedule doesn't exist, create it
            if ( schedule[newScheduleTitle] === undefined ) {
                schedule[Date.now()] = {
                    title: newScheduleTitle,
                    time: newScheduleTime,
                    date: newScheduleDate
                }

                runtime.brain.set("schedule", schedule);

                chat.sendMessage(`Added schedule: ${newScheduleTitle}`);
            } else {

                //If that schedule is already added, return "Schedule already added"
                chat.sendMessage("Schedule already added");
            }
        }
    }
}, {
    types: ['message'],
    regex: deleteScheduleRegex,
    action: function( chat, stanza ) {

        //Get the user who typed the command
        var user = chat.getUser( stanza.user.username );

        //If that user is a streamer they can continue
        if ( user.isModerator() ) {

            //Get the regex groups
            var match = deleteScheduleRegex.exec( stanza.message );

            var scheduleId = match[2];
            var scheduleTitle = match[3];

            //Get the schedule from the brain
            var schedule = runtime.brain.get("schedule");

            if( scheduleId in schedule){
                delete schedule[scheduleId];
            }

            runtime.brain.set("schedule", schedule);

        }
    }
}];