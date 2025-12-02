
 /*
 To achieve an infinite stream of procedural sound, we create 2 small audio buffers (buffer A and B) each with the capacity of 1 second of audio (an array the size of the audio sample rate).
 The goal is to alternate between the two buffers every second. For example, While buffer B is being loaded with audio data, buffer A is currently playing back it's audio and as soon as it
 finishes, buffer B will start playing it's newly loaded audio, right where buffer A left off. Now buffer A loads the next second of audio while buffer B plays back and the cycle continues.

*/

const CHUNK_DURATION = 1.0;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var bLength = audioCtx.sampleRate * CHUNK_DURATION;

// The two audio buffers, A and B
//var bufferA = audioCtx.createBuffer(2, bLength, audioCtx.sampleRate);
//var bufferB = audioCtx.createBuffer(2, bLength, audioCtx.sampleRate);

var buffers = [audioCtx.createBuffer(2, bLength, audioCtx.sampleRate), audioCtx.createBuffer(2, bLength, audioCtx.sampleRate)];

var startA = 0;
var startB = 0;
var timeA = 0;
var timeB = 0;

document.getElementById("bSize").innerHTML = "Buffer Length: " + bLength;
document.getElementById("cTime").innerHTML = "Time: " + 0.0;



var isPlaying = true;

 

// Updates the time value for nodes that need it
function updateTimeNodes(t){
    for (var i = 0; i < timeNodes.length; i++) 
    {
        timeNodes[i].inputs[0].value = t;
        timeNodes[i].outputs[0].value = t;
    }
}


function getCurrentTime(){
    for (var i = 0; i < timeNodes.length; i++) 
    {
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


function updateGraphNodes(i, timeOffset, t, ct)
{

    for (var j = 0; j < graphNodes.length; j++) 
    {

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


function clearAllGraphNodes()
{
    for (var j = 0; j < graphNodes.length; j++) 
    {
        clearCanvas(graphNodes[j].canvas);
        drawLines({cnvs: graphNodes[j].canvas, scale: graphNodes[j].canvasScale});
        graphNodes[j].graphCounter = 0;
    }
    evaluateGraph();
}

function updateAllGraphCounters()
{
    for (var j = 0; j < graphNodes.length; j++) 
    {
        graphNodes[j].graphCounter++;
    }
}

function testGraphics()
{
    //clearAllGraphNodes();

    evaluateAllNodes();
    //evaluateGraph();
    load(bufferA);
    updateAllGraphCounters();
    globalTime++;

}


function evaluateGraph()
{
    for (var k = 0; k < 8; k++) {
        for (var i = 0; i < buffers[0].length; i++) {
            let t = (i*CHUNK_DURATION) / bLength;
            updateTimeNodes(t + globalTime);
            evaluateAllNodes();
            updateGraphNodes(i, t, getCurrentTime());
        }
        updateAllGraphCounters();
        globalTime++;
    }
}

function currTime()
{
    let d = new Date();
    return d.getTime();
}

// Load the next chunk of audio into the specified buffer
function load(buffer, startTime)
{
    let t;

    // Channel 0 (left)
    var cBuffer = buffer.getChannelData(0);
    for (var i = 0.0; i < buffers[0].length; i++) 
    {
        t = globalTime + i / audioCtx.sampleRate;

        updateTimeNodes(t + globalTime);
        evaluateAllNodes();

        cBuffer[i] = outputNode.inputs[0].value.x;

        if(breakOutOfEverything == true){
            breakOutOfEverything = false;
            console.log("Uh oh");
            break;
        }
    }
    
    // Channel 1 (right)
    cBuffer = buffer.getChannelData(1);
    for (var i = 0.0; i < buffers[0].length; i++) 
    {
        t = globalTime + i / audioCtx.sampleRate;

        updateTimeNodes(t + globalTime);
        evaluateAllNodes();
        
        cBuffer[i] = outputNode.inputs[0].value.y;
        
        if(breakOutOfEverything == true){
            breakOutOfEverything = false;
            console.log("Uh oh");
            break;
        }
    }
}

var globalTime = 0.0; // Keeps track of the total time
let nextStartTime = 0;
let bufferIndex = 0;
let scheduledSources = [];

function scheduleNextChunk() 
{
    const buffer = buffers[bufferIndex];

    load(buffer, audioCtx.currentTime);

    globalTime += CHUNK_DURATION;


    // Ensure nextStartTime is always slightly in the future
    const now = audioCtx.currentTime;
    if (nextStartTime < now + 0.05) 
    {
        nextStartTime = now + 0.05;
    }

    // Create a fresh source node for this playback
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(audioCtx.destination);

    // This is the critical part: start at an exact time
    src.start(nextStartTime);

    scheduledSources.push(src);

    // Update nextStartTime for the following chunk
    nextStartTime += CHUNK_DURATION;

    bufferIndex = 1 - bufferIndex;

}

// Keep the queue “topped up” so there’s always some audio scheduled
function keepQueueFull() 
{
    if(!isPlaying) return;

    const lookAhead = 2.0; // seconds of audio we want queued in advance
    const now = audioCtx.currentTime;

    while (nextStartTime < now + lookAhead) 
    {
        scheduleNextChunk();
    }

    // Call again from the main thread occasionally (timing here isn't critical)
    setTimeout(keepQueueFull, 100);
}



// Start playback from button
document.getElementById("StartButton").addEventListener("click", async () => {
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
    nextStartTime = audioCtx.currentTime; // start at "now"
    isPlaying = true;
    keepQueueFull();
});



function stopAudio(){
    isPlaying = false;

    // Stop all scheduled sources
    scheduledSources.forEach(src => {
        try { src.stop(); } catch {}
    });

    scheduledSources.length = 0; // clear array

    // Reset timeline (optional)
    nextStartTime = audioCtx.currentTime;
    globalTimeSec = 0;
    
}


var timerInterval;
var initialTime;

function updateTimer(){
    var cTime = new Date();
    var currentTime = caudioCtx.currentTime - initialTime; 
   
    document.getElementById("cTime").innerHTML = "Time: " + (currentTime).toFixed(2);

}

// Starts the playback timer
function startTimer(){
    var cTime = new Date();
    initialTime = audioCtx.currentTime;

    timerInterval = clearInterval(updateTimer);
    timerInterval = setInterval(updateTimer, 1);
}
function stopTimer(){
    timerInterval = clearInterval(updateTimer);
}

function initialize(){
    
}

