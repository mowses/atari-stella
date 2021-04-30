'use strict'

function current_is_greater_than(s1, s2)
{
    return ((s1 > s2) && (s1 - s2 <= 2147483648)) ||
           ((s1 < s2) && (s2 - s1 > 2147483648));
}

// pass the port and url of the server
var channel = geckos({ port: 3000, url: 'http://localhost' })

channel.onConnect(function(error) {

	const current_is_greater = current_is_greater_than;
	var last_sequence = -1;

	if (error) {
		console.log('ERROR connecting!');
		//console.error(error.message)
		return
	} else {
		console.log("You're connected!")
	}

	channel.onDisconnect(function() {
		console.log('You got disconnected')
	})

	channel.on('chat message', function(data) {
		let cc = String.fromCharCode;
		let current_sequence = +(data.data.splice(0, 10).map( cp => cc( cp ) ).join(''));
		
		if (current_sequence < last_sequence) {
			if (!current_is_greater(current_sequence, last_sequence)) {
				//console.log('received old data... discarding:', current_sequence, last_sequence);
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

		render(output);
		last_sequence = current_sequence;
	})
})