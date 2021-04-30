'use strict'

// pass the port and url of the server
var channel = geckos({ port: 3000, url: 'http://localhost' })

channel.onConnect(function(error) {
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
		let output = {};
		let len = 8;

		for (var i = 0, t = data.data.length - (len - 1); i < t; i += len) {
			let pixel = data.data.slice(i, i+5).map( cp => cc( cp ) ).join('') << 0;
			let color = data.data.slice(i+5, i+8).map( cp => cc( cp ) ).join('') << 0;
			output[pixel] = color;
		}

		render(output);
	})
})