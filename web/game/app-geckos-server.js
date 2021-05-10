const fs = require('fs');
const geckos = require('@geckos.io/server').default;
const { iceServers } = require('@geckos.io/server');
const dgram = require('dgram');

const address = '127.0.0.1';
const vport = 23;
const aport = 24;

const io = geckos({
	iceServers: process.env.NODE_ENV === 'production' ? iceServers : []
})
const connected_clients = [];

function current_is_greater_than(s1, s2)
{
    return ((s1 > s2) && (s1 - s2 <= 2147483648)) ||
           ((s1 < s2) && (s2 - s1 > 2147483648));
}

// VIDEO SOCKET
const vserver = dgram.createSocket('udp4');
var vlast_sequence = -1;

vserver.on('error', (err) => {
	console.log(`vserver error:\n${err.stack}`);
	vserver.close();
	
	// close channels here...
	connected_clients.forEach((channel) => {
		channel.close();
	});
});

vserver.on('message', (msg, rinfo) => {
	let buffer = Buffer.from(msg);
	let current_sequence = +(buffer.slice(0, 10).toString());
	if (current_sequence < vlast_sequence) {
		if (!current_is_greater_than(current_sequence, vlast_sequence)) {
			//console.log('received old data... discarding:', current_sequence, vlast_sequence);
			return;
		}
	}

	//console.log(`vserver got: ${msg} from ${rinfo.address}:${rinfo.port}`);

	connected_clients.forEach((channel) => {
		channel.emit('video received', buffer)
	});
	vlast_sequence = current_sequence;
});

vserver.on('listening', () => {
	const address = vserver.address();
	console.log(`vserver listening ${address.address}:${address.port}`);
});

vserver.bind(vport, address);
// END VIDEO SOCKET


// AUDIO SOCKET
const aserver = dgram.createSocket('udp4');
var alast_sequence = -1;

aserver.on('error', (err) => {
	console.log(`aserver error:\n${err.stack}`);
	aserver.close();
});

aserver.on('message', (msg, rinfo) => {
	let buffer = Buffer.from(msg);
	let current_sequence = +(buffer.slice(0, 10).toString());
	if (current_sequence < alast_sequence) {
		if (!current_is_greater_than(current_sequence, alast_sequence)) {
			//console.log('received old data... discarding:', current_sequence, alast_sequence);
			return;
		}
	}

	//console.log(`aserver got: ${msg} from ${rinfo.address}:${rinfo.port}`);

	connected_clients.forEach((channel) => {
		channel.emit('audio received', buffer)
	});
	alast_sequence = current_sequence;
});

aserver.on('listening', () => {
	const address = aserver.address();
	console.log(`aserver listening ${address.address}:${address.port}`);
});

aserver.bind(aport, address);
// END AUDIO SOCKET


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
