// (origin at 0 point of the horizontal scale graphic)
var ORIGIN_X = 128;        // in canvas coordinates
var ORIGIN_Y = 141;        // in canvas coordinates
// (origin at 0 point of the vertical scale graphic)
//var ORIGIN_X = 8;            // in canvas coordinates
//var ORIGIN_Y = 117;          // in canvas coordinates
var METERS_TO_CANVAS_X = 15.65;     
var METERS_TO_CANVAS_Y = 8.15;     
var MAP_WIDTH = 599;
var MAP_HEIGHT = 586;

// Open a WebSocket to the origin server.
var socket = io();         

// Handle "move" message received through the socket.
socket.on("move", function(posStr) {
    console.log(posStr);
    var pos = JSON.parse(posStr);
    document.getElementById("posX").value = pos.x;
    document.getElementById("posY").value = pos.y;
    document.getElementById("posYaw").value = pos.yaw;
        updateRect();
    });
   
    function writeToHistory(x, y, yaw) {
        var historyConsole = document.getElementById("historyConsole");
    var timestamp = new Date().toLocaleTimeString(); 
    historyConsole.innerHTML = "<div>" + timestamp + ": x=" + x + ", y=" + y + ", yaw=" + yaw + "</div>" + historyConsole.innerHTML;
}

function clearCanvas() {
    var cnvs = document.getElementById("mapCanvas");
    var ctx = cnvs.getContext("2d");
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
}

function drawRect(cnvsX, cnvsY, width, height, color, theta) {
    var cnvs = document.getElementById("mapCanvas");
    var ctx = cnvs.getContext("2d");
    ctx.beginPath();
    if (!theta) {
        ctx.rect(cnvsX - (width / 2), cnvsY - (height / 2), width, height);
    } else {
        // Draw a rotated rectangle using the given theta (angle)
        var x = cnvsX - ORIGIN_X;
        var y = cnvsY - ORIGIN_Y;
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var cosA = Math.cos(theta * (Math.PI / 180));
        var sinA = Math.sin(theta * (Math.PI / 180));
        // Start from upper left.
        ctx.moveTo((x + halfWidth * cosA - halfHeight * sinA) + ORIGIN_X,  
                   (y + halfHeight * cosA + halfWidth * sinA) + ORIGIN_Y);
        // Draw line to upper right.
        ctx.lineTo((x - halfWidth * cosA - halfHeight * sinA) + ORIGIN_X, 
                   (y + halfHeight * cosA - halfWidth * sinA) + ORIGIN_Y);
        // Draw line to bottom right.
        ctx.lineTo((x - halfWidth * cosA + halfHeight * sinA) + ORIGIN_X, 
                   (y - halfHeight * cosA  - halfWidth * sinA) + ORIGIN_Y);
        // Draw line to bottom left.
        ctx.lineTo((x + halfWidth * cosA + halfHeight * sinA) + ORIGIN_X, 
                   (y - halfHeight * cosA  + halfWidth * sinA) + ORIGIN_Y);
    }
    ctx.fillStyle = color || "red";
    ctx.fill();
}

function updateRect() {
    var rawX = document.getElementById("posX").value;
    var rawY = document.getElementById("posY").value;
    var yaw = document.getElementById("posYaw").value;
    writeToHistory(rawX, rawY, yaw);

    var x = (rawX * METERS_TO_CANVAS_X) + ORIGIN_X;
    var y = (rawY * METERS_TO_CANVAS_Y) + ORIGIN_Y;
    if (isNaN(x) || isNaN(y) || isNaN(yaw)) {
        return;
    }
    clearCanvas();
    drawRect(x, y, 4, 8, "red", yaw);
}

function incPos(elementId, inc) {
    var curValue = document.getElementById(elementId).value;
    curValue = parseInt(curValue) + (inc || 1);
    document.getElementById(elementId).value = curValue;
    updateRect();
}

function decPos(elementId, dec) {
    var curValue = document.getElementById(elementId).value;
    curValue -= (dec || 1);
    document.getElementById(elementId).value = curValue;
    updateRect();
}

function setStyleDims(id, width, height) {
    var elem = document.getElementById(id);
    elem.style.width = width;
    elem.style.height = height;
}

function onPageLoad() {
    setStyleDims("containerDiv", MAP_WIDTH + 400, MAP_HEIGHT);
    setStyleDims("mapDiv", MAP_WIDTH, MAP_HEIGHT);
    setStyleDims("map", MAP_WIDTH, MAP_HEIGHT);
    setStyleDims("mapCanvas", MAP_WIDTH, MAP_HEIGHT);
    setStyleDims("historyConsole", 350, MAP_HEIGHT - 40);
    
    document.getElementById("posX").value = 0;
    document.getElementById("posY").value = 0;
    document.getElementById("posYaw").value = 0;
    updateRect();
}

// Add event handlers.
document.querySelector("body").onload = onPageLoad;
document.getElementById("posX").onchange = updateRect;
document.getElementById("incPosX").onclick = function() { incPos('posX') } 
document.getElementById("decPosX").onclick = function() { decPos('posX') }

document.getElementById("posY").onchange = updateRect;
document.getElementById("incPosY").onclick = function() { incPos('posY') } 
document.getElementById("decPosY").onclick = function() { decPos('posY') } 

document.getElementById("posYaw").onchange = updateRect;
document.getElementById("incPosYaw").onclick = function() { incPos('posYaw', 5) } 
document.getElementById("decPosYaw").onclick = function() { decPos('posYaw', 5) } 
