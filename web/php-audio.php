<?php
// cd /home/unknown/stella/web/; php -S localhost:2001;
// <audio controls>
  //   <source src="http://localhost:2001/php-audio.php" type="audio/mp3">
  // </audio>

// $file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';

// header('Content-Type: audio/mpeg');
// header('Content-length: ' . filesize($file));
// print file_get_contents($file);

header('HTTP/1.1 200 OK');
header('Content-Type: audio/mpeg');
header('Cache-Control: no-cache');
header('Content-Transfer-Encoding: chunked');

$fp = fsockopen('localhost', 5000) or die('error');

while (!feof($fp)) {
    echo fgets($fp, 512);
}

fclose($fp);