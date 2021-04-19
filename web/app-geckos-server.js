const geckos = require('@geckos.io/server').default
const { iceServers } = require('@geckos.io/server')

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const address = '127.0.0.1';
const port = 13;

const io = geckos({
	iceServers: process.env.NODE_ENV === 'production' ? iceServers : []
})

// listen on port 3000 (default is 9208)
io.listen(3000)

io.onConnection(channel => {
	channel.onDisconnect(() => {
		console.log(`${channel.id} got disconnected`)
	})

	channel.emit('chat message', `Welcome to the chat ${channel.id}!`)

	server.on('error', (err) => {
		console.log(`server error:\n${err.stack}`);
		server.close();
		// close channel too here...
	});

	server.on('message', (msg, rinfo) => {
		//console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
		channel.emit('chat message', `This is the game data: ${msg}`)
	});

	server.on('listening', () => {
		const address = server.address();
		console.log(`server listening ${address.address}:${address.port}`);
	});

	server.bind(port, address);

})
