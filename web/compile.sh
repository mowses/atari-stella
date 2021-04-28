tput reset;
sudo kill -9 $(pgrep -f 'app-geckos-server.js');
sudo kill -9 $(pgrep -f 'php -S localhost:2001');
sudo node app-geckos-server.js > /tmp/app-geckos-server.log & echo "Node server started ...";

/home/unknown/stella/configure &&
make -C /home/unknown/stella &&
bash -c 'cd /home/unknown/stella/web; exec php -S localhost:2001' &
bash -c 'cd /home/unknown/stella/web; exec php socket.php > /tmp/socket.log' &
sleep 1;  # wait for http server to be ready
curl http://localhost:2001/php-audio.php > /tmp/php-audio.mp3 &
firefox http://localhost:2001/render_web.html &&
exec /home/unknown/stella/stella -holdreset /home/unknown/Downloads/Enduro\ \(USA\).zip &
#exec /home/unknown/stella/stella -holdreset /home/unknown/Downloads/River\ Raid\ \(USA\).zip &
#exec /home/unknown/stella/stella -holdreset /home/unknown/Downloads/Seaquest.zip &
#exec /home/unknown/stella/stella -holdreset /home/unknown/Downloads/Turmoil\ \(USA\).zip &

LASTPID=$!;
SINK_INPUT='';
while [ -z "$SINK_INPUT" ]; do
	SINK_INPUT=$(pactl list sink-inputs | perl -nle '/Sink Input #(\d+)/ and $si = $1; /application\.process\.id.*?(\d+)/ and ($1 == '$LASTPID') and print "$si"');
	#echo 'current SINK_INPUT is ' $SINK_INPUT 'and LASTPID is ' $LASTPID "\n";
	sleep 1;
done

# grava o som tocado
#parec --monitor-stream  $(pacmd list-sink-inputs|tac|perl -E'undef$/;$_=<>;/RUNNING.*?index: (\d+)\n/s;say $1') --format=s16le --channels=2 --file-format=aiff newrecording.aiff

# dá output no netcat UDP porta 3002
#mas antes, rodar o comando:
#nc -lu localhost 3002 | paplay --verbose --raw --format=s16le --channels=1;

# mute game instance audio - should not mute it :(
pactl set-sink-input-mute $SINK_INPUT 0;

# send sound over netcat
parec --monitor-stream $SINK_INPUT --format=s16le --channels=1 | ffmpeg -f s16le -ar 44100 -ac 1 -i pipe: -b:a 128k -f webm pipe: | nc -u localhost 3002;