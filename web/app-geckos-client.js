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

	var to = null;
	channel.on('chat message', function(data) {
		// next tick
		// quando aberto multiplas instancias do navegador, o processo de recebimento
		// e processo das informacoes demora mais do que é possivel dar conta, ocasionando
		// lag no jogo. isso é pq o navegador nao dá conta de processar todo o recebimento
		// dos dados.
		// pra solucionar este problema, fiz o settimeout abaixo, porem ele pode atrasar um pouco
		// a renderizacao no client ou talvez ate nao renderizar o jogo (isso nao aconteceu durante
		// os testes, mas creio que seja possivel)
		// talvez tentar usar algo como next tick
		// ou diminuir um pouco a taxa de envio
		// percebi tbm q o cleartimeout com settimeout tbm deixa um pouco lento, de forma geral, até mesmo o emulador, porem o canvas esta sempre renderizando o ultimo frame
		// talvez fazer um "processo" diferente, talvez apenas setar o valor da variavel data
		// e num loop infinito, só renderizar o canvas...
		clearTimeout(to);
		to = setTimeout(function() {
			let cc = String.fromCharCode;
			let current_sequence = +(data.data.splice(0, 10).map( cp => cc( cp ) ).join(''));
			if (current_sequence < last_sequence) {
				if (!current_is_greater(current_sequence, last_sequence)) {
					console.log('received old data... discarding:', current_sequence, last_sequence);
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
		});
		
	})
})