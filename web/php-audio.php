<?php
// setup for streaming data
error_reporting(0);
if (function_exists('apache_setenv')) {
    @apache_setenv('no-gzip', 1);
}
@ini_set('implicit_flush', true);
@ini_set('output_buffering', 'off');
@ini_set('zlib.output_compression', false);
while (@ob_end_flush());
ob_implicit_flush(true);

// Explicitly disable caching so Varnish and other upstreams won't cache.
header("Cache-Control: no-cache, must-revalidate");
// Setting this header instructs Nginx to disable fastcgi_buffering and disable
// gzip for this request.
header('X-Accel-Buffering: no');
///////////////////////////////////


define('HOST', '127.0.0.1');
define('PORT', 5000);

/*
$file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';

header('Content-Type: audio/mpeg');
header('Content-length: ' . filesize($file));
print file_get_contents($file);
*/

// $fp = fsockopen(HOST, PORT) or exit('cant connect');

header('HTTP/1.1 200 OK');
//header('Content-Type: text/html');
header('Content-Type: audio/mp3');
header('Content-Transfer-Encoding: chunked');

// while (!feof($fp)) {
//     echo fread($fp, 128 * 1024);
// }

// fclose($fp);

//echo shell_exec('nc 127.0.0.1 5000 &');

// define('SINK_INPUT', 84);
// $cmd = 'parec --monitor-stream ' . SINK_INPUT . ' --format=s16le --channels=1 | ffmpeg -vn -loglevel quiet -y -f s16le -ar 44100 -ac 1 -i pipe: -b:a 32k -preset ultrafast -f mp3 pipe:';
$cmd = 'ffmpeg -vn -loglevel quiet -y -i tcp://' . HOST . ':' . PORT . ' -ac 1 -b:a 8k -f mp3 pipe: < /dev/null 2> /dev/null';

$descriptorspec = [
   ['pipe', 'r'],   // stdin is a pipe that the child will read from
   ['pipe', 'w'],   // stdout is a pipe that the child will write to
   ['pipe', 'w'],   // stderr is a pipe that the child will write to
];

$process = proc_open($cmd, $descriptorspec, $pipes);

if (is_resource($process)) {
    while ($s = fgets($pipes[1])) {
        echo $s;
        @ob_flush();
        @flush();
    }
}

fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);