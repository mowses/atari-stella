##############################
HOST='localhost';
PORT=3002;
##############################
function destruct()
{
	sudo kill -9 $(pgrep -f 'php audio-socket.php');
	sudo kill -9 $(pgrep -f 'app-geckos-server.js');
	sudo kill -9 $(pgrep -f 'ffmpeg -loglevel quiet');
	
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
ROM="/home/unknown/stella/web/roms/Enduro (USA).zip";
#ROM="/home/unknown/stella/web/roms/River Raid (USA).zip";
#ROM="/home/unknown/stella/web/roms/Seaquest.zip";
#ROM="/home/unknown/stella/web/roms/Turmoil (USA).zip";
#ROM="/home/unknown/stella/web/roms/Pitfall II - Lost Caverns (USA).zip";
#ROM="/home/unknown/stella/web/roms/Pac-Man (USA).zip";
firefox http://localhost/stella/web/render_web.html &
exec /home/unknown/stella/stella -holdreset \
	-audio.volume 50 -audio.device -1 -audio.fragment_size 256 -audio.sample_rate 44100 -audio.stereo 0 \
	-audio.resampling_quality 1 -audio.headroom 0 -audio.buffer_size 0 \
	-stream.video "/tmp/stella-video.sock" -stream.audio "/tmp/stella.audio.sock" \
	-stream.player.1 "/tmp/player1-input.sock" -stream.player.2 "/tmp/player2-input.sock" \
	"$ROM" &
STELLA_PID=$!;
echo 'STELLA PID:' $STELLA_PID;

echo 'Waiting for game to finish ...';
while [ -d /proc/$STELLA_PID ] ; do
	sleep 1
done;
echo 'GAME WAS FINISHED...';
destruct > /dev/null 2>&1;