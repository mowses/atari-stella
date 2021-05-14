const fs = require('fs');
const geckos = require('@geckos.io/server').default;
const { iceServers } = require('@geckos.io/server');
const dgram = require('dgram');
const PORT = 3000;

const address = '127.0.0.1';
const vport = 23;
const aport = 24;

const io = geckos({
	iceServers: process.env.NODE_ENV === 'production' ? iceServers : [],
	ordered: false,
	maxRetransmits: 0,
	autoManageBuffering: true,  // If autoManageBuffering is on, Geckos.io will prefer to drop messages instead of adding them to the send queue.
})
const connected_clients = [];

function current_is_greater_than(s1, s2)
{
    return ((s1 > s2) && (s1 - s2 <= 2147483648)) ||
           ((s1 < s2) && (s2 - s1 > 2147483648));
}

// PLAYER INPUT FIFO STREAM
const p0_fifo = '/tmp/player-0';
const p1_fifo = '/tmp/player-1';
const p0_fifoWS = fs.createWriteStream(p0_fifo);
const p1_fifoWS = fs.createWriteStream(p1_fifo);
// const IPC = require('node-ipc').IPC;
// const ipc = new IPC;
// ipc.config.encoding='hex';
// console.log('NODE.js is Opening fifo at ' + p0_fifo + '...');

// // ipc.connectTo('player0', p0_fifo, (socket) => {
// // 	const myBuffer = Buffer.alloc(2).fill(0);
// // 	myBuffer.writeUInt8(16);
// // 	console.log(myBuffer);
// // });
// ipc.serve(p0_fifo, function() {
// 	console.log('foi?');
// 	// ipc.server.emit(
//  //        socket,
//  //        'message',  //this can be anything you want so long as
//  //                    //your client knows.
//  //        data+' world!'
//  //    );
// });
// const fd = fs.openSync('/tmp/player-0', fs.constants.O_WRONLY | fs.constants.O_TRUNC | fs.constants.O_NONBLOCK);
// console.log(fd, 'HEREEEEEEEEEEEEEEEEE');
// const p1_fifo_input = new net.Socket({ fd, readable: false, writable: true });
// const p1_fifo_input = net.createConnection('/tmp/player-0');
// console.log(p1_fifo_input);
// END PLAYER INPUT FIFO STREAM

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
		if (channel.userData.audioEnabled === false) return;
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


io.listen(PORT)

io.onConnection(channel => {

	channel.onDisconnect(() => {
		let index = connected_clients.indexOf(channel);
		if (index !== -1) {
			connected_clients.splice(index, 1);
		}
		console.log(`${channel.id} got disconnected`)
	})

	channel.on('audio toggle', (toggle) => {
		channel.userData.audioEnabled = toggle === undefined ? !channel.userData.audioEnabled : !!toggle;
	});

	channel.on('player pressed keys', (pressed_keys) => {
		//const myBuffer = Buffer.alloc(2).fill(0);
		//myBuffer.writeUInt8(pressed_keys);
		//console.log('player have pressed keys', pressed_keys);
		p0_fifoWS.write('' + pressed_keys);
	});

	connected_clients.push(channel);

	//channel.emit('chat message', `Welcome to the chat ${channel.id}!`)  // ja tem channel.emit Buffer.from

})
