<?php

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
header('Content-Type: audio/webm');
header('Cache-Control: no-cache');
header('Content-Transfer-Encoding: chunked');

// while (!feof($fp)) {
//     echo fread($fp, 128 * 1024);
// }

// fclose($fp);

//echo shell_exec('nc 127.0.0.1 5000 &');

$cmd = 'ffmpeg -vn -loglevel quiet -y -i tcp://' . HOST . ':' . PORT . ' -ac 1 -b:a 8k -f webm pipe: < /dev/null 2> /dev/null';

$descriptorspec = [
   ['pipe', 'r'],   // stdin is a pipe that the child will read from
   ['pipe', 'w'],   // stdout is a pipe that the child will write to
   ['pipe', 'w'],   // stderr is a pipe that the child will write to
];

$process = proc_open($cmd, $descriptorspec, $pipes);

if (is_resource($process)) {
    while ($s = fgets($pipes[1])) {
        echo $s;
        flush();
    }
}

fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);