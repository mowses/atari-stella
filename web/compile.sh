##############################
HOST='localhost';
PORT=3002;
##############################
function destruct()
{
	if [ $FFMPEG_PID ]; then
		sudo kill -9 $FFMPEG_PID;
	fi;

	sudo kill -9 $(pgrep -f 'php audio-socket.php');
	sudo kill -9 $(pgrep -f 'app-geckos-server.js');
	sudo kill -9 $(pgrep -f 'php -S localhost');
	
	if [ $SINK ]; then
		pactl unload-module $SINK;
	fi;

	# remove all null-sink
	# pactl unload-module module-null-sink;
}

function get_sink_source_index()
{
	echo -n $(pactl list sources | perl -nle '/Source #(\d+)/ and $si = $1; /Owner Module: (\d+)/ and ($1 == '$SINK') and print "$si"');
}
##############################
clear;
destruct > /dev/null 2>&1;

# start servers
sudo node app-geckos-server.js > /tmp/stella-geckos-server.log 2>&1 &
echo "Node server started ...";
bash -c 'cd /home/unknown/stella/web; exec php -S localhost:2001 > /tmp/stella-http-server.log 2>&1' &
bash -c 'cd /home/unknown/stella/web; exec php audio-socket.php > /tmp/stella-audio-socket.log 2>&1' &
sleep 1;  # wait for http server to be ready


# create audio sink for this game session
SINK=$(pactl load-module module-null-sink sink_name='stella-null-sink');
echo 'AUDIO SINK FOR THIS SESSION: '$SINK' WITH ID: #'$(get_sink_source_index);
# list sinks command reference: pactl list short sinks

# (re)compile game
#/home/unknown/stella/configure &&
#make -C /home/unknown/stella;

# test audio and open browser
#curl -s http://localhost:2001/php-audio.php > /tmp/php-audio.webm &
ROM="/home/unknown/Downloads/Enduro (USA).zip";
#ROM="/home/unknown/Downloads/River Raid (USA).zip";
#ROM="/home/unknown/Downloads/Seaquest.zip";
#ROM="/home/unknown/Downloads/Turmoil (USA).zip";
firefox http://localhost:2001/render_web.html &
exec /home/unknown/stella/stella -holdreset -stream.hostname "127.0.0.1" -stream.port "23" -audio.device -1 "$ROM" &
STELLA_PID=$!;
echo 'STELLA PID:' $STELLA_PID;

# record and send sound to UDP
exec ffmpeg -loglevel quiet -vn -f pulse -i $(get_sink_source_index) -ar 44100 -ac 1 -b:a 32k -preset ultrafast -f mpegts udp://$HOST:$PORT &
FFMPEG_PID=$!;

echo 'Waiting for game to finish ...';
while [ -d /proc/$STELLA_PID ] ; do
	sleep 1
done;
echo 'GAME WAS FINISHED...';
destruct > /dev/null 2>&1;