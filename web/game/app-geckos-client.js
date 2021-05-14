'use strict'

function current_is_greater_than(s1, s2)
{
    return ((s1 > s2) && (s1 - s2 <= 2147483648)) ||
           ((s1 < s2) && (s2 - s1 > 2147483648));
}

// pass the port and url of the server
var channel = geckos({
	url: window.location.protocol + '//' + window.location.hostname,
	port: 3000,
})

channel.onConnect(function(error) {

	const current_is_greater = current_is_greater_than;
	var alast_sequence = -1;
	var vlast_sequence = -1;

	if (error) {
		console.log('ERROR connecting!', error.message);
		//console.error(error.message)
		return
	} else {
		console.log("You're connected!")
	}

	channel.onDisconnect(function() {
		console.log('You got disconnected')
		game.player.isConnected = false;
	})

	game.player.isConnected = true;
	
	channel.on('video received', function(data) {
		let cc = String.fromCharCode;
		let current_sequence = +(data.data.splice(0, 10).map( cp => cc( cp ) ).join(''));
		if (current_sequence < vlast_sequence) {
			if (!current_is_greater(current_sequence, vlast_sequence)) {
				// console.log('received old video data... discarding:', current_sequence, vlast_sequence);
				return;
			}
		}

		let output = {};
		let len = 8;

		for (var i = 0, t = data.data.length - (len - 1); i < t; i += len) {
			let pixel = +(data.data.slice(i, i+5).map( cp => cc( cp ) ).join(''));
			let color = +(data.data.slice(i+5, i+8).map( cp => cc( cp ) ).join(''));
			output[pixel] = color;
		}

		game.data.video = output;
		vlast_sequence = current_sequence;
	})

	channel.on('audio received', function(data) {
		if (channel.userData.audioEnabled === false) return;

		let cc = String.fromCharCode;
		let current_sequence = +(data.data.splice(0, 10).map( cp => cc( cp ) ).join(''));
		if (current_sequence < alast_sequence) {
			if (!current_is_greater(current_sequence, alast_sequence)) {
				//console.log('received old audio data... discarding:', current_sequence, alast_sequence);
				return;
			}
		}

		let output = [];
		let len = 7;

		for (var i = 0, t = data.data.length - (len - 1); i < t; i += len) {
			let buffer_index = +(data.data.slice(i, i+5).map( cp => cc( cp ) ).join(''));
			let mixing_table_index = +(data.data.slice(i+5, i+7).map( cp => cc( cp ) ).join(''));
			output[buffer_index] = mixing_table_index;
		}

		audio_manager.appendFragment(build_complete_audio_fragment(output));
		alast_sequence = current_sequence;
	})
})