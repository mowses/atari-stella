const fs = require('fs');
const geckos = require('@geckos.io/server').default;
const { iceServers } = require('@geckos.io/server');
const dgram = require('dgram');

const server = dgram.createSocket('udp4');
const address = '127.0.0.1';
const port = 23;

const io = geckos({
	iceServers: process.env.NODE_ENV === 'production' ? iceServers : []
})
const connected_clients = [];

var last_sequence = -1;

function current_is_greater_than(s1, s2)
{
    return ((s1 > s2) && (s1 - s2 <= 2147483648)) ||
           ((s1 < s2) && (s2 - s1 > 2147483648));
}

server.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	server.close();
	
	// close channels here...
	connected_clients.forEach((channel) => {
		channel.close();
	});
});

server.on('message', (msg, rinfo) => {
	let buffer = Buffer.from(msg);
	let current_sequence = +(buffer.slice(0, 10).toString());
	if (current_sequence < last_sequence) {
		if (!current_is_greater_than(current_sequence, last_sequence)) {
			//console.log('received old data... discarding:', current_sequence, last_sequence);
			return;
		}
	}

	//console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

	connected_clients.forEach((channel) => {
		channel.emit('chat message', buffer)
	});
	last_sequence = current_sequence;
});

server.on('listening', () => {
	const address = server.address();
	console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(port, address);

// listen on port 3000 (default is 9208)
io.listen(3000)

io.onConnection(channel => {

	// // audio stream
	// const file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';
	// const highWaterMark = 20;
	// const readable = fs.createReadStream(file, { highWaterMark });
	// const stat = fs.statSync(file);
	
	// readable.on('data', function(chunk) {
	// 	channel.emit('audio stream', chunk);
	// });
	// end audio stream

	channel.onDisconnect(() => {
		let index = connected_clients.indexOf(channel);
		if (index !== -1) {
			connected_clients.splice(index, 1);
		}
		console.log(`${channel.id} got disconnected`)
	})

	connected_clients.push(channel);

	//channel.emit('chat message', `Welcome to the chat ${channel.id}!`)  // ja tem channel.emit Buffer.from

})
