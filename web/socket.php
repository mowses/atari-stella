<?php

error_reporting(0);
set_time_limit(60);

// UDP server socket definition
define('UDP_IP', 'localhost');
define('UDP_PORT', 3002);
define('UDP_BUFFER', 128 * 1024);

// client socket connection definition
// clients should connect here!
define('IP', 'localhost');
define('PORT', 5000);
define('MAX_CLIENT', 10);

require_once 'lib/socket.php';

if(!($sock = socket_create(AF_INET, SOCK_DGRAM, 0)))
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);

    die("Couldn't create socket: [$errorcode] $errormsg \n");
}

// Bind the source address
if( !socket_bind($sock, UDP_IP, UDP_PORT) )
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);

    die("Could not bind socket : [$errorcode] $errormsg \n");
}

$socket = new Socket();
$socket->run();

echo "Waiting for UDP data and client connections... \n";

while($buf = socket_read($sock, UDP_BUFFER))
{
    $socket->accept_multi_client();
    $socket->broadcast_to_clients($buf);
}

socket_close($sock);
socket_close($socket::$sock);