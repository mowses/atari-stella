<?php

class Socket {

    public static $address = IP;
    public static $port = PORT;
    public static $max_clients = MAX_CLIENT;
    public static $client_socks;
    public static $sock;
    public static $read;

    public $sequence_wrap_around = 32768;

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

    /**
     * if your UDP socket is sending a control sequence number
     * use this method to make check if the sequence number were
     * wrapped around.
     * 
     * ex: if you sent a sequence number as UINT16 (0-65535)
     * and the current packet is 65535, then the next packet
     * will wrap around, returning to ZERO, but
     * in this case, the packet 0 is greater than 65535
     */
    public function current_is_greater_than(int $s1, int $s2): bool
    {
        return (($s1 > $s2) && ($s1 - $s2 <= $this->sequence_wrap_around)) ||
               (($s1 < $s2) && ($s2 - $s1 > $this->sequence_wrap_around));
    }
}