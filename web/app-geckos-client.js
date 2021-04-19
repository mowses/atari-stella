'use strict'

const message = document.getElementById('message');

// pass the port and url of the server
var channel = geckos({ port: 3000, url: 'http://localhost' })

channel.onConnect(function(error) {
		if (error) {
				console.error(error.message)
				return
		} else {
				console.log("You're connected!")
		}

		channel.onDisconnect(function() {
				console.log('You got disconnected')
		})

		channel.on('chat message', function(data) {
				//console.log('received chat message:', data);
				message.innerText = `received chat message: ${data}`;
		})
})