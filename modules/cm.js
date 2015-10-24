"use strict";

/**
 * Main file for loading the custom
 * modules to the master index file
 */

 var fs = require('fs');
 var Log = require('../Log');
 var cmUrl = "./modules/custom_commands";

module.exports = {
    getCustomModules: function(arg) {
        fs.readdir( cmUrl , function( err, files ) {
            if ( err ) {
                Log.log( 'ERROR: ' + err );
            }

            files.forEach( function(fileName) {
                if ( fileName.indexOf( '.js' ) >= 0 ) {
                    console.log("Succesfully loaded module: " + fileName );
                    arg.push( require( '../modules/custom_commands/' + fileName ) );
                }
            } );
        });
    }
}