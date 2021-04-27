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

        echo "Waiting for incoming connections... \n";

        //array of client sockets
        socket::$client_socks = array();
    }

    function accept_multi_client() {
        //prepare array of readable client sockets
        socket::$read = array();

        //first socket is the master socket
        socket::$read[0] = socket::$sock;

        //now add the existing client sockets
        for ($i = 0; $i < socket::$max_clients; $i++) {
            if (socket::$client_socks[$i] != null) {
                socket::$read[$i + 1] = socket::$client_socks[$i];
            }
        }

        //now call select - blocking call
        if (socket_select(socket::$read, $write, $except, null) === false) {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            print("Could not listen on socket : [$errorcode] $errormsg \n");
        }

        //if ready contains the master socket, then a new connection has come in
        if (in_array(socket::$sock, socket::$read)) {
            for ($i = 0; $i < socket::$max_clients; $i++) {
                if (socket::$client_socks[$i] == null) {
                    socket::$client_socks[$i] = socket_accept(socket::$sock);

                    //display information about the client who is connected
                    if (socket_getpeername(socket::$client_socks[$i], $address, $port)) {
                        echo "Client $address : $port is now connected to us. \n";
                    }

                    //Send Welcome message to client
                    $message = "\nEnter a message and press enter, and i shall reply back \n";
                    socket_write(socket::$client_socks[$i], $message);
                    break;
                }
            }
        }
    }

    function speak() {

        for ($i = 0; $i < socket::$max_clients; $i++) {
            if (in_array(socket::$client_socks[$i], socket::$read)) {

                $client_input = socket_read(socket::$client_socks[$i], 1024);
                
                if ($client_input == null) {
                    //zero length string meaning disconnected, remove and close the socket
                    socket_close(socket::$client_socks[$i]);
                    unset(socket::$client_socks[$i]);
                    continue;
                }

                $output = "The server replied back: $client_input";

                echo "A client sent: $client_input";

                //$output = $this->do_anything($client_input, $i);
               // echo $output;
                //send response to client
                socket_write(socket::$client_socks[$i], $output);
                //socket_close(socket::$client_socks[$i]);
            }
        }
    }

    function do_anything($client_input, $i) {

        $filename = 'ee.mp3';
        ob_start();
        //ob_end_clean();
            if (file_exists($filename)) {
                print('HTTP/1.1 200 OK'."\n");
                print('Content-Type: audio/mpeg'." ");
                print('Content-Disposition: filename="test.mp3"'."\n");
                print('Content-length: ' . 1129297 ."\n");
                /*print('Cache-Control: no-cache'." ");
                print("Content-Transfer-Encoding: chunked"." ");*/



                $handle = fopen($filename, "r");
                $contents = fread($handle, filesize($filename));

            } else {
                print("HTTP/1.0 404 Not Found");
            }

            $out = ob_get_contents();

        //ob_end_clean();

        return $out.$contents;
    }

}