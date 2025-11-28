


var outputNode;
var nodes = [];




function createNode(type, x, y){
    var node = null;

    if(type == "Add"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "a", type: "Number", inputBox: true, hasConnector: true}, {name: "b", type: "Number", inputBox: true, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: true, hasOutput: true, priority: false},

            function(node){
                var sum = 0;
                for(let i = 0; i < node.inputs.length; i++){
                    sum += node.inputs[i].value;
                }
                node.outputs[0].value = sum;
            }
        );
        return node;
    }
    else if(type == "Subtract"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "a", type: "Number", inputBox: true, hasConnector: true}, {name: "b", type: "Number", inputBox: true, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = node.inputs[0].value - node.inputs[1].value;
            }
        );
        return node;
    }
    else if(type == "Value"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "", type: "Number", inputBox: true, hasConnector: false}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: true},

            function(node){
                node.outputs[0].value = node.inputs[0].value;
            }
        );
        return node;
    }
    else if(type == "Multiply"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "a", type: "Number", inputBox: true, hasConnector: true}, {name: "b", type: "Number", inputBox: true,hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: true, hasOutput: true, priority: false},

            function(node){
                var product = 1.0;
                for(let i = 0; i < node.inputs.length; i++){
                    product *= node.inputs[i].value;
                }
                node.outputs[0].value = product;
            }
        );

        nodes.push(node);
        return node;
    }
    else if(type == "Stereo"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "L", type: "Number", inputBox: true, hasConnector: true}, {name: "R", type: "Number", inputBox: true, hasConnector: true}], 
            [{name: "out", type: "Vec2"}], 
            {canAddInputs: true, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = {x: node.inputs[0].value, y: node.inputs[1].value};
            }
        );
        return node;
    }
    else if(type == "Splitter"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "vec2", type: "Vec2", inputBox: false, hasConnector: true}], 
            [{name: "x", type: "Number"}, {name: "y", type: "Number", value: 0}], 
            {canAddInputs: true, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = inputs[0].value.x;
                node.outputs[1].value = inputs[0].value.y;
            }
        );
        return node;
    }
    else if(type == "Output"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "sound", type: "Vec2", inputBox: false, hasConnector: true}], 
            [], 
            {canAddInputs: false, hasOutput: false, priority: false},

            function(node){
                node.inputs[0].value.x = node.inputs[0].connectedOutput.value.x;
                node.inputs[0].value.y = node.inputs[0].connectedOutput.value.y;
            }
        );
        return node;
    }
    else if(type == "Time"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "", type: "Number", inputBox: false, hasConnector: false}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: true},

            function(node){
                node.outputs[0].value = node.inputs[0].value;
            }
        );
        nodes.push(node);
        timeNodes.push(node);
        return node;
    }
    else if(type == "Pi2"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "", type: "Number", inputBox: false, hasConnector: false}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: true},

            function(node){
                node.outputs[0].value = 6.2831853071;
            }
        );
        return node;
    }
    else if(type == "Cos"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = Math.cos(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Mod"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "A", type: "Number", inputBox: true, hasConnector: true}, {name: "B", type: "Number", inputBox: true, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = mod(node.inputs[0].value, node.inputs[1].value);
            }
        );
        return node;
    }
    else if(type == "Floor"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = floor(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Exp"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = exp(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Min"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = min(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Max"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = max(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Sqrt"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = sqrt(node.inputs[0].value);
            }
        );
        return node;
    }
    else if(type == "Graph"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "In", type: "Number", inputBox: false, hasConnector: true}, {name: "Width", type: "Number", inputBox: true, hasConnector: true}, {name: "Height", type: "Number", inputBox: true, hasConnector: true}],
            [{name: "", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = node.inputs[0].value;
            }
        );
        return node;
    }
    else if(type == "Oscillator"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "Hz", type: "Number", inputBox: true, hasConnector: true}, {name: "Time", type: "Number", inputBox: false, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                node.outputs[0].value = cos(node.inputs[1].value * node.inputs[0].value * 3.14159 * 2);
            }
        );
        return node;
    }
    else if(type == "Summation"){
        node = new Node(
            type, 
            {x: x, y: y}, 
            [{name: "I", type: "Number", inputBox: true, hasConnector: false}, {name: "A", type: "Number", inputBox: true, hasConnector: true}], 
            [{name: "out", type: "Number"}], 
            {canAddInputs: false, hasOutput: true, priority: false},

            function(node){
                var sum = 0;
                for(let i = 0; i < node.inputs[0].value; i++){
                    sum += node.inputs[1].value;
                }
                node.outputs[0].value = sum;
            }
        );
        return node;
    }
    else
        return null;
}


Node.prototype.checkIfReady = function(){
    for(var i = 0; i < this.inputs.length; i++){
        if(this.inputs[i].isDirty)
            return false;
    }
    return true;
}



var breakOutOfEverything = false;

function evaluateAllNodes(){
    //console.log("Evaluating All Nodes...");

    // Copy of all the current nodes
    let next = Array.from(nodes);

    // Count number of iterations for debug
    var count = 0;


    // Go through the nodes and update them in the right order
    while(next.length > 0){
        for(var i = 0; i < next.length; i++){
            // Are all the inputs of this node updated?
            if(next[i].checkIfReady()){
                
                // Evaluate the node
                next[i].evaluate(next[i]);

                // Go through all the node's outputs
                for(var j = 0; j < next[i].outputs.length; j++){
                    // Go through all the output's connected inputs
                    for(var k = 0; k < next[i].outputs[j].connectedInputs.length; k++){
                        // Set the input as ready
                        next[i].outputs[j].connectedInputs[k].isDirty = false;

                        // Set all the inputs connected to this output of the ready node to the value of the ready node's output.
                        next[i].outputs[j].connectedInputs[k].value = next[i].outputs[j].value;
                    }
                }


                // Take this node out
                next.splice(i, 1);
            }
        }

        count++;
        // Something probably went very wrong
        if(count > 50){
            console.log("problem");
            breakOutOfEverything = true;
            break;
        }
    }

    next = [];

    // Finally update the output node if something is connected to it
    if(outputNode.inputs[0].connectedOutput)
        outputNode.evaluate(outputNode);


    /*
    // Reset the inputs
    for(var i = 0; i < nodes.length; i++){
        if(!nodes[i].specs.priority){
            for(var j = 0; j < nodes[i].inputs.length; j++){
                nodes[i].inputs[j].isDirty = true;
            }
        }
    }
*/
}


var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;

    
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);


var timeNodes = [];
var graphNodes = [];


document.body.onmousedown = function (e) {
    mouse.down = true;
    getMousePos(e);
    
    if (keyState[65]){ // A
        nodes.push(createNode("Add", mouse.x, mouse.y));
    }
    else if(keyState[77]){ // M;
        createNode("Multiply", mouse.x, mouse.y);
    }
    else if(keyState[83]){ // S;
        nodes.push(createNode("Subtract", mouse.x, mouse.y));
    }
    else if(keyState[50]){ // 2
        nodes.push(createNode("Stereo", mouse.x, mouse.y));
    }
    else if(keyState[86]){ // V
        nodes.push(createNode("Splitter", mouse.x, mouse.y));
    }
    else if(keyState[49]){ // 1
        nodes.push(createNode("Value", mouse.x, mouse.y));
    }
    else if(keyState[84]){ // T
        createNode("Time", mouse.x, mouse.y);
    }
    else if(keyState[80]){ // p
        nodes.push(createNode("Pi2", mouse.x, mouse.y));
    }
    else if(keyState[67]){ // C
        nodes.push(createNode("Cos", mouse.x, mouse.y));
    }
    else if(keyState[70]){ // F
        nodes.push(createNode("Floor", mouse.x, mouse.y));
    }
    else if(keyState[82]){ // R
        nodes.push(createNode("Sqrt", mouse.x, mouse.y));
    }
    else if(keyState[66]){ // B
        nodes.push(createNode("Mod", mouse.x, mouse.y));
    }
    else if(keyState[69]){ // E
        nodes.push(createNode("Exp", mouse.x, mouse.y));
    }
    else if(keyState[89]){ // Y
        nodes.push(createNode("Min", mouse.x, mouse.y));
    }
    else if(keyState[85]){ // U
        nodes.push(createNode("Max", mouse.x, mouse.y));
    }
    else if(keyState[71]){ // G
        let nGraphNode = createNode("Graph", mouse.x, mouse.y);
        nodes.push(nGraphNode);
        graphNodes.push(nGraphNode);
    }
    else if(keyState[79]){ // O
        nodes.push(createNode("Oscillator", mouse.x, mouse.y));
    }
    else if(keyState[88]){ // X
        nodes.push(createNode("Summation", mouse.x, mouse.y));
    }
    else{
        console.log("Down");
        //boxSelect.selecting = true;
        //boxSelect.svg = createPath({x: mouse.x, y: mouse.y}, {x: mouse.x, y: mouse.y});

        if(!hoveringOnNode && nodes.length > 0)
            clearSelectedNodes();

    }
}


$(document).ready(function() {
    // Output node
    outputNode = createNode("Output", 1400, 450);

    //nodes.push(createNode("Graph", 300, 350));

    nodes.push(createNode("Stereo", 900, 450));
    nodes.push(createNode("Oscillator", 600, 350));
    nodes.push(createNode("Oscillator", 600, 550));
    nodes.push(createNode("Time", 400, 420));

    nodes[1].outputs[0].connect(nodes[0].inputs[0]); // Connect oscillator 1 to stereo input 1
    nodes[2].outputs[0].connect(nodes[0].inputs[1]); // Connect oscillator 2 to stereo input 2

    nodes[3].outputs[0].connect(nodes[1].inputs[1]); // Connect time 1 to oscillator 1
    nodes[3].outputs[0].connect(nodes[2].inputs[1]); // Connect time 2 to oscillator 2

    nodes[0].outputs[0].connect(outputNode.inputs[0]); // Connect stereo to output

    initialize();

});