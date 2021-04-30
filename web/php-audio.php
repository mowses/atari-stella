<?php

/*
$file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';

header('Content-Type: audio/mpeg');
header('Content-length: ' . filesize($file));
print file_get_contents($file);
*/

$fp = fsockopen('localhost', 5000) or exit('cant connect');

header('HTTP/1.1 200 OK');
header('Content-Type: audio/mpeg');
header('Cache-Control: no-cache');
header('Content-Transfer-Encoding: chunked');

while (!feof($fp)) {
    echo fread($fp, 128 * 1024);
}

fclose($fp);