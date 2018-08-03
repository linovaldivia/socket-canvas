# Socket-Canvas: socket.io client and HTML5 canvas demo

This repository demonstrates the use of the socket.io node.js library as well as the HTML5 canvas element.
The HTML page shows a red rectangle that can be moved along the x and y axis, as well as rotate along the [yaw axis](https://en.wikipedia.org/wiki/Yaw_(rotation)). The rectangle can be moved using controls in the page (e.g. move +1 meter along the x axis) or "remotely" by POSTing to an HTTP endpoint in the server.

Aside from serving as a demo this code can be used as a basis for further projects involving socket.io and/or HTML5 canvas manipulation.

## Usage

First, install required node packages:

    npm install
    
Then, start the server (uses 8080 by default, but this can be easily changed by setting the `PORT` constant inside `index.js`):
    
    node index.js

Now you can point your browser to `http://localhost:8080/` to view the page and move the rectangle using the controls.

To change the position of the rectangle using an HTTP post from the command line:

    curl -X POST -H "Content-Type: application/json" -d '{ "x": 4, "y": -7, "yaw": 45 }' http://localhost:8080/move