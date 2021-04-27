<?php

error_reporting(0);
set_time_limit(10);

define('IP', '0.0.0.0');
define('PORT', '5000');
define('MAX_CLIENT', 10);

require_once 'lib/socket.php';

$socket = new socket();
$socket->run();
while (TRUE){
    $socket->accept_multi_client();
    $socket->speak();
}