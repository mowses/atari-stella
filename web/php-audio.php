<?php

/*
$file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';

header('Content-Type: audio/mpeg');
header('Content-length: ' . filesize($file));
print file_get_contents($file);
*/

// WE HAVE A BUG HERE
// SINCE WE ARE RECEIVING THE DATA AS STREAM
// A CLIENT THAT IS CONNECTING AFTER THE SESSION BEGIN
// COULD NOT RECEIVE THE "HEADER" OF THE AUDIO
// MAKING THE AUDIO INVALID OR CORRUPT (???)
// pra testar esse erro, basta rodar o compile.sh, e depois de iniciar o jogo, (talves depois que tenha jogado um pouco) em outra aba no terminal:
// php php-audio.php > /tmp/php-audio2.webm
// jogue um pouco e depois feche tudo. verás que o arquivo salvo (php-audio2.webm) tem dados dentro dele, mas ele nao toca pelo player.
// 
$fp = fsockopen('localhost', 5000) or exit('cant connect');

header('HTTP/1.1 200 OK');
header('Content-Type: audio/mpeg');
header('Cache-Control: no-cache');
header('Content-Transfer-Encoding: chunked');

while (!feof($fp)) {
    echo fread($fp, 128 * 1024);
}

fclose($fp);