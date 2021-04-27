var http = require("http");
var port = 8888;
var host = "localhost";
var children = require("child_process");

http
  .createServer(function (req, res) {
    //ffmpeg -f s16le -ar 48000 -ac 2 -i 'udp://192.168.1.230:65535' -b:a 128k -f webm -
    var ffm = children.spawn(
      "ffmpeg",
      "-f s16le -ar 44100 -ac 1 -i udp://localhost:3002 -b:a 128k -f webm -".split(
        " "
      )
    );

    res.writeHead(200, { "Content-Type": "audio/webm;codecs=vorbis" });
    ffm.stdout.on("data", (data) => {
      console.log(data);
      res.write(data);
    });
  })
  .listen(port, host);

console.log("Server running at http://" + host + ":" + port + "/");