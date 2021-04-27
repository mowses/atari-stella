<?php
// cd /home/unknown/stella/web/; php -S localhost:2001;
// <audio controls>
  //   <source src="http://localhost:2001/php-audio.php" type="audio/mp3">
  // </audio>
// $file = '/var/www/html/stella/web/Kamen_Rider_Black_RX_OP.mp3';

// header('Content-Type: audio/mpeg');
// header('Content-length: ' . filesize($file));
// print file_get_contents($file);

//header('Content-Type: audio/mpeg');

// $fp = fsockopen('udp://localhost', 3002) or die('error');

// while (!feof($fp)) {
//     echo fgets($fp, 256);
// }

// fclose($fp);
// echo 'ACOBOU';


error_reporting(0);
set_time_limit(10);

//Create a UDP socket
if(!($sock = socket_create(AF_INET, SOCK_DGRAM, 0)))
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);

    die("Couldn't create socket: [$errorcode] $errormsg \n");
}

echo "Socket created \n";

// Bind the source address
if( !socket_bind($sock, "localhost", 3002) )
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);

    die("Could not bind socket : [$errorcode] $errormsg \n");
}

echo "Socket bind OK \n";

while($buf = socket_read($sock, 512))
{
    echo $buf;
}

socket_close($sock);