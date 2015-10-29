'use strict';

const https = require('https');
const request = require('request');
const moment = require('moment');
const querystring = require('querystring');
const StringDecoder = require('string_decoder').StringDecoder;
const runtime = require('../../utils/Runtime');
const settings = require('./settings.json');

let token = null;

module.exports = [{
    types: ['message'],
	regex: /^(!|\/)discord$/,
    action: function( chat, stanza ) {
		// If the Discord invite link is now invalid,
		// fetch a new one
		if ( isInviteUrlExpired() ) {
			getDiscordInvite( function( inviteUrl ) {
				chat.sendMessage( `Join our Discord community at ${ inviteUrl }` );
			} );
			return;
		}

		let inviteData = runtime.brain.get('plugin-discord').inviteData;
		chat.sendMessage( `Join our Discord community at ${ inviteData.url }` );
    }
}, {
    types: ['presence'],
	regex: /^available$/,
    action: function( chat, stanza ) {
		if ( stanza.user.viewCount <= 1 ) {
			// If the Discord invite link is now invalid,
			// fetch a new one
			if ( isInviteUrlExpired() ) {
				getDiscordInvite( function( inviteUrl ) {
					chat.replyTo( stanza.user.username, `Join our Discord community at ${ inviteUrl }` );
				} );
				return;
			}

			let inviteData = runtime.brain.get('plugin-discord').inviteData;
			chat.replyTo( stanza.user.username, `Join our Discord community at ${ inviteData.url }` );
		}
    }
}, {
    types: ['startup'],
    action: function( chat ) {
		if ( isInviteUrlExpired() ) {
			request.post({
				url: 'https://discordapp.com/api/auth/login',
				formData: {
					email: settings.discordEmail,
					password: settings.discordPassword
				}
			}, function( err, httpResponse, body ) {
				if ( err ) {
					console.error('[discord] Error logging into discord', err);
					return;
				}
				body = JSON.parse( body );
				token = body.token;

				console.info('[discord] Logged into Discord');

				getDiscordInvite();
			});
		}
    }
}];

/**
 * Gets a new Discord invite url.
 * @param  {Function} callback - optional
 * @return {void}
 */
function getDiscordInvite( callback ) {
	// Get an invite URL from discord
	request.post({
		url: 'https://discordapp.com/api/channels/108234208916348928/invites',
		headers: {
			'authorization' : token
		},
		formData: {
			valdiate: ''
		}
	}, function( err, httpResponse, body ) {
		if ( err ) {
			console.error('[discord] Error fetching invite link', err);
			return;
		}
		body = JSON.parse( body );

		let createdAt = moment( body.created_at );
		let expiresAt = body.max_age === 0 ? 0 : createdAt.add( body.max_age, 's' ).valueOf()

		console.info( '[discord] Fetched invite url', body.code, body.max_age );

		let discordObj = {
			inviteData : {
				expiresAt: expiresAt,
				url: 'https://discord.gg/' + body.code
			}
		}
		runtime.brain.set('plugin-discord', discordObj);

		if ( callback ) {
			callback( discordObj.inviteData.url );
		}
	});
}

/**
 * Returns a boolean if the invite url is expired.
 * @return {Boolean}
 */
function isInviteUrlExpired() {
	if ( !runtime.brain.get('plugin-discord') ) {
		return true;
	}

	let inviteData = runtime.brain.get('plugin-discord').inviteData;
	if ( inviteData.expiresAt > 0 ) {
		let now = moment();

		if ( now.isAfter( moment( inviteData.expiresAt ) ) ) {
			return true;
		}
	}
	return false;
}
