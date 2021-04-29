#################
HOST='localhost';
PORT=3002;

OUTPUT1='/tmp/output1.webm';
OUTPUT2='/tmp/output2.webm';
#################
function clear_all () {
	sudo kill -9 $(pgrep -f 'php php-audio');
	sudo kill -9 $(pgrep -f 'Kamen_Rider_Black_RX_OP');
	sudo kill -9 $(pgrep -f 'nc -');
	sudo kill -9 $(pgrep -f 'php socket.php');
}
#################
tput reset;
clear_all > /dev/null 2>&1;
bash -c 'exec mplayer -ss 00:00:11 Kamen_Rider_Black_RX_OP.mp3 > /dev/null 2>&1' &
LASTPID=$!;
SINK_INPUT='';
while [ -z "$SINK_INPUT" ]; do
	SINK_INPUT=$(pactl list sink-inputs | perl -nle '/Sink Input #(\d+)/ and $si = $1; /application\.process\.id.*?(\d+)/ and ($1 == '$LASTPID') and print "$si"');
	sleep 0.1;
done

echo 'LASTPID:' $LASTPID;
echo 'SINK_INPUT:' $SINK_INPUT;

php socket.php &
php php-audio.php > $OUTPUT1 &

# nc -lu $HOST $PORT > $OUTPUT1 &
# echo 'Listening on '$HOST':'$PORT;
# echo 'Recording the playing audio for output 1 ... ';

# send sound to UDP
parec --monitor-stream $SINK_INPUT --format=s16le --channels=1 | ffmpeg -vn -f s16le -ar 44100 -ac 1 -i pipe: -b:a 32k -preset ultrafast -f mpegts udp://$HOST:$PORT 2> /dev/null &
echo 'STREAMING AUDIO TO '$HOST':'$PORT'...';
sleep 7;

php php-audio.php > $OUTPUT2 &
sleep 2;
echo 'Recording for output 2 ...';
sleep 7;


clear_all > /dev/null 2>&1;
echo 'Output 1 saved at' $OUTPUT1;
echo 'Output 2 saved at' $OUTPUT2;
