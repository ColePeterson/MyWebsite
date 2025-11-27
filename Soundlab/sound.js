
 /*
 To achieve an infinite stream of procedural sound, we create 2 small audio buffers (buffer A and B) each with the capacity of 1 second of audio (an array the size of the audio sample rate).
 The goal is to alternate between the two buffers every second. For example, While buffer B is being loaded with audio data, buffer A is currently playing back it's audio and as soon as it
 finishes, buffer B will start playing it's newly loaded audio, right where buffer A left off. Now buffer A loads the next second of audio while buffer B plays back and the cycle continues.

*/

const bufferSeconds = 1.0;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var bLength = audioCtx.sampleRate * bufferSeconds;

// The two audio buffers, A and B
var bufferA = audioCtx.createBuffer(2, bLength, audioCtx.sampleRate);
var bufferB = audioCtx.createBuffer(2, bLength, audioCtx.sampleRate);


var startA = 0;
var startB = 0;
var timeA = 0;
var timeB = 0;

document.getElementById("bSize").innerHTML = "Buffer Length: " + bLength;
document.getElementById("cTime").innerHTML = "Time: " + 0.0;



var pause = true;

 

// Updates the time value for nodes that need it
function updateTimeNodes(t){
    for (var i = 0; i < timeNodes.length; i++) {
        timeNodes[i].inputs[0].value = t;
        timeNodes[i].outputs[0].value = t;
    }
}


function getCurrentTime(){
    for (var i = 0; i < timeNodes.length; i++) {
        return timeNodes[i].outputs[0].value;
    }
}


/*
function updateGraphNodes(i, timeOffset){

    for (var j = 0; j < graphNodes.length; j++) {
        for (var k = 0; k < graphNodes[j].canvasScale; k++) {
            let height = graphNodes[j].canvas.height - padding*2;
            let width = graphNodes[j].canvas.width - padding*2;

            let nx = (Math.floor((i / 48000) * width)) / graphNodes[j].canvasScale*0.5;
            let ny = graphNodes[j].outputs[0].value / graphNodes[j].canvasScale;

            let x = nx + padding + k*(width/graphNodes[j].canvasScale)*0.5;
            let y = (height/2) - (ny*(height/2)) + padding;

            if(x <= width && x >= 0 && y >= padding && y <= height - padding){
                drawFunction(graphNodes[j].canvas, x, y);
            }
        }
    }

}
*/


function updateGraphNodes(i, timeOffset, t, ct){

    for (var j = 0; j < graphNodes.length; j++) {

        //updateTimeNodes(t + graphNodes[j].graphCounter);

        let height = graphNodes[j].canvas.height - padding*2;
        let width = graphNodes[j].canvas.width - padding*2;

        let nx = (Math.floor((i / 48000) * width)) / graphNodes[j].canvasScale*0.5;
        let ny = graphNodes[j].outputs[0].value / graphNodes[j].canvasScale;

        let x = nx + padding + graphNodes[j].graphCounter*(width/graphNodes[j].canvasScale) * 0.5;
        //let x = nx + padding + timeOffset*(width/graphNodes[j].canvasScale) * 0.5;
        let y = (height/2) - (ny*(height/2)) + padding;

        if(x <= width && x >= 0 && y >= padding && y <= height - padding){
            drawFunction(graphNodes[j].canvas, x, y);
        }
    }

    //updateTimeNodes(ct);
}


function clearAllGraphNodes(){
    for (var j = 0; j < graphNodes.length; j++) {
        clearCanvas(graphNodes[j].canvas);
        drawLines({cnvs: graphNodes[j].canvas, scale: graphNodes[j].canvasScale});
        graphNodes[j].graphCounter = 0;
    }
    evaluateGraph();
}

function updateAllGraphCounters(){
    for (var j = 0; j < graphNodes.length; j++) {
        graphNodes[j].graphCounter++;
    }
}

function testGraphics(){
    //clearAllGraphNodes();

    evaluateAllNodes();
    //evaluateGraph();
    load(bufferA);
    updateAllGraphCounters();
    counter++;

}


function evaluateGraph(){
    for (var k = 0; k < 8; k++) {
        for (var i = 0; i < bufferB.length; i++) {
            let t = (i*bufferSeconds) / bLength;
            updateTimeNodes(t + counter);
            evaluateAllNodes();
            updateGraphNodes(i, t, getCurrentTime());
        }
        updateAllGraphCounters();
        counter++;
    }
}

function currTime()
{
    let d = new Date();
    return d.getTime();
}

var deltaTime = 0.0;

// Load the next chunk of audio into the specified buffer
function load(buffer, startTime){
    let t;

    var offset = document.getElementById("test").value;

    // Channel 0 (left)
    var cBuffer = buffer.getChannelData(0);
    for (var i = 0.0; i < bufferB.length; i++) {
        t = (i*bufferSeconds) / bLength;

        updateTimeNodes(t + counter);
        evaluateAllNodes();

        //if(buffer == bufferA)
            //updateGraphNodes(i, counter);

        cBuffer[i] = outputNode.inputs[0].value.x;

        if(breakOutOfEverything == true){
            breakOutOfEverything = false;
            console.log("Uh oh");
            break;
        }
    }
    
    // Channel 1 (right)
    cBuffer = buffer.getChannelData(1);
    for (var i = 0.0; i < bufferB.length; i++) {
        t = (i*bufferSeconds) / bLength;
        
        updateTimeNodes(t + counter);
        evaluateAllNodes();
        
        cBuffer[i] = outputNode.inputs[0].value.y;
        
        if(breakOutOfEverything == true){
            breakOutOfEverything = false;
            console.log("Uh oh");
            break;
        }
    }

    deltaTime = currTime() - startTime;
}

/*
The functions runA() and runB() are infinitely recursive as long as the user doesn't press pause.
This is where the buffer alternating, or ping ponging happens.
*/


var counter = 0.0; // Keeps track of the total time


// Play the audio in buffer B
function runB(){
    var source = audioCtx.createBufferSource();
    source.buffer = bufferB;
    source.connect(audioCtx.destination);
    source.start(); // Start B

   
    counter += bufferSeconds; // Increase total time by length of buffer in seconds
    load(bufferA, 0); // Load the next chunk of audio into buffer A

    console.log("runB: " + counter);

    

    // Once B is finished playing, run A
    source.onended = function(){
        //console.log("runB onEnd: " + counter);
        runA();
    }
}

function runA(){
    var source = audioCtx.createBufferSource();
    source.buffer = bufferA;
    source.connect(audioCtx.destination);
    source.start(); // Start A
    startA = currTime();
    
    counter += bufferSeconds; // Increase total time by length of buffer in seconds
    load(bufferB, 0); // Load the next chunk of audio into buffer B
    console.log("runA: " + counter);

   
        
    // Once A is finished playing, run B
    source.onended = function(){
        //console.log("runA onEnd: " + counter);
        runB();
    }
}

// Start the recursion
function startAudio(){
    pause = false;
    evaluateGraph();
    
    load(bufferA, currTime()); // Buffer A will load first
    runA();
    startTimer();
}








function stopAudio(){
    pause = true;
    counter = 0;
    stopTimer();
}


var timerInterval;
var initialTime;

function updateTimer(){
    var cTime = new Date();
    var currentTime = cTime.getTime() - initialTime; 
   
    document.getElementById("cTime").innerHTML = "Time: " + (currentTime / 1000).toFixed(2);

}

// Starts the playback timer
function startTimer(){
    var cTime = new Date();
    initialTime = cTime.getTime();

    timerInterval = clearInterval(updateTimer);
    timerInterval = setInterval(updateTimer, 1);
}
function stopTimer(){
    timerInterval = clearInterval(updateTimer);
}

function initialize(){
    
}

