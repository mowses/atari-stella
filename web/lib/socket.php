<?php

class socket {

    public static $address = IP;
    public static $port = PORT;
    public static $max_clients = MAX_CLIENT;
    public static $client_socks;
    public static $sock;
    public static $read;

    function run() {
        if (!(socket::$sock = socket_create(AF_INET, SOCK_STREAM, 0))) {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            die("Couldn't create socket: [$errorcode] $errormsg \n");
        }

        echo "Socket created \n";

        // Bind the source address
        if (!socket_bind(socket::$sock, socket::$address, socket::$port)) {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            die("Could not bind socket : [$errorcode] $errormsg \n");
        }

        echo "Socket bind OK \n";

        if (!socket_listen(socket::$sock, socket::$max_clients)) {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            die("Could not listen on socket : [$errorcode] $errormsg \n");
        }

        echo "Socket listen OK \n";

        //array of client sockets
        socket::$client_socks = array();
    }

    function accept_multi_client() {
        //prepare array of readable client sockets
        socket::$read = array_filter(socket::$client_socks);

        //first socket is the master socket
        array_unshift(socket::$read, socket::$sock);

        //now call select - non blocking call
        if (socket_select(socket::$read, $write, $except, 0) === false) {
            return;
        }

        if (!in_array(socket::$sock, socket::$read)) return;
        
        // read contains the master socket, then a new connection has come in
        
        if (count(socket::$client_socks) >= socket::$max_clients) return;
        
        socket::$client_socks[] = $client_sock = socket_accept(socket::$sock);

        //display information about the client who is connected
        if (socket_getpeername($client_sock, $address, $port)) {
            echo "Client $address : $port is now connected to us. \n";
        }

        // send welcome message to client
        // $message = "\nEnter a message and press enter, and i shall reply back \n";
        // socket_write($client_sock, $message);
    }
    
    /**
     * broadcast data to connected clients
     */
    function broadcast_to_clients($str) {
        foreach (socket::$client_socks as $i => $socket) {
            $wr = socket_write($socket, $str);

            if ($wr === false) {
                // false meaning error, so lets close and remove the socket
                socket_shutdown($socket, 2);
                socket_close($socket);
                unset(socket::$client_socks[$i]);
                continue;
            }
        }
    }

    // function do_anything($client_input, $i) {

    //     $filename = 'ee.mp3';
    //     ob_start();
    //     //ob_end_clean();
    //         if (file_exists($filename)) {
    //             print('HTTP/1.1 200 OK'."\n");
    //             print('Content-Type: audio/mpeg'." ");
    //             print('Content-Disposition: filename="test.mp3"'."\n");
    //             print('Content-length: ' . 1129297 ."\n");
    //             print('Cache-Control: no-cache'." ");
    //             print("Content-Transfer-Encoding: chunked"." ");



    //             $handle = fopen($filename, "r");
    //             $contents = fread($handle, filesize($filename));

    //         } else {
    //             print("HTTP/1.0 404 Not Found");
    //         }

    //         $out = ob_get_contents();

    //     //ob_end_clean();

    //     return $out.$contents;
    // }

}