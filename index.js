// Port on which this server will listen for HTTP requests.
const PORT = 8080;

// Create the express app object.
var express = require("express");
var app = express();

// Serve static content (html, js, css, etc) from the directory named "public"
app.use(express.static("public"));  

// Set up the body-parser object to handle JSON-encoded payloads.
var bodyParser = require("body-parser")
app.use(bodyParser.json());         

// Handle the /move HTTP POST endpoint.
app.post('/move', function (req, res) {
    var responseObj = { ok: true, x: req.body.x, y:req.body.y, yaw:req.body.yaw };
    var response = JSON.stringify(responseObj);
    console.log(response);
    res.send(response);

    // Notify connected WebSockets of new position data by emitting a "move" event.
    if (req.body.x && req.body.y && req.body.yaw) {
        io.emit("move", response);
    }
});

// Not strictly necessary, just a friendly message to remind us how to set the position.
app.get('/move', function(req, res) {
    res.send("Use HTTP POST (instead of GET) in order to set new position.");
});

// Set up socket.io with the http server.
var http = require("http").Server(app);
var io = require("socket.io")(http);

// Listen for WebSocket connection and disconnection events.
io.on('connection', function(socket){
    console.log("Socket connected!");
    socket.on('disconnect', function() {
		console.log("Socket disconnected!");
    });
  
});

// Finally, start listening on the configured port for requests.
http.listen(PORT, function () {
    console.log("Now listening on port " + PORT);
});


