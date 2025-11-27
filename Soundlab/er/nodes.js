


function Node(name, pos, inputList, outputList, specs, evaluateNode){
    var that = this;

    this.name = name;
    this.specs = specs;

    this.inputs = [];
    this.outputs = [];
    
    this.evaluate = evaluateNode;

    this.isSelected = false;

    this.canvas = null;
    this.canvasScale = 2;
    this.graphRange = 1;
    this.graphCounter = 0;

    this.ix = 220;
    this.iy = 220;

    // Create base DOM element with title
    this.nodeParentEl = document.createElement('div');
    this.nodeParentEl.classList.add('nodeParentEl');
    this.nodeParentEl.innerHTML = name;

    // Create the node body DOM element
    this.nodeBody = document.createElement('div');
    this.nodeBody.classList.add('nodeBody');
    
    this.hoverInfoEl = document.createElement('div');
    this.hoverInfoEl.classList.add('hoverInfo');
    this.hoverInfoEl.style.display = "none";

    this.nodeParentEl.appendChild(this.hoverInfoEl);


    
    

    this.nodeParentEl.onmousemove = function(){
        //that.hoverInfoEl.style.display = "block";
        
        let infoStr = "Inputs: <br />";

        for(let i = 0; i < that.inputs.length; i++){
            let name = that.inputs[i].name;
            if(name == "") name = "In";
            
            
            infoStr += (name + " - " + that.inputs[i].value + "<br />");
        }

        infoStr += "Outputs: <br />";

        for(let i = 0; i < that.outputs.length; i++){
            let name = that.outputs[i].name;
            
            infoStr += (name + " - " + that.outputs[i].value + "<br />");
        }

        that.hoverInfoEl.innerHTML = infoStr;

    }

    this.nodeParentEl.onmouseenter = function(){
        //that.hoverInfoEl.style.display = "none";
        hoveringOnNode = true;

    }

    this.nodeParentEl.onmouseleave = function(){
        //that.hoverInfoEl.style.display = "none";
        hoveringOnNode = false;
    }

    for(var i = 0; i < outputList.length; i++){
        this.addOutput(outputList[i]);
    }

    for(var i = 0; i < inputList.length; i++){
        this.addInput(inputList[i]);
    }


    

    this.nodeParentEl.appendChild(this.nodeBody);


    if(name == "Graph"){
        var newCanvas = document.createElement('canvas');

        newCanvas.width = 512;
        newCanvas.height = 512;
        newCanvas.style.zIndex = 8;
        newCanvas.style.position = "absolute";
        newCanvas.style.left = "110%";
        newCanvas.style.border = "2px inset";
        newCanvas.style.borderRadius = "5px";
        newCanvas.style.borderColor = "rgb(0, 0, 0)";


        clearCanvas(newCanvas);
        drawLines({cnvs: newCanvas, scale: this.canvasScale});

        this.canvas = newCanvas;
        that.nodeParentEl.appendChild(newCanvas);

        this.canvas.addEventListener("wheel", event => {
            const delta = Math.sign(event.deltaY);
            that.canvasScale += delta;
            clearCanvas(that.canvas);
            drawLines({cnvs: that.canvas, scale: that.canvasScale});
            that.graphCounter = 0;
            clearAllGraphNodes();
           // evaluateGraph();
            //testGraphics();
        });


    }

    

    this.nodeParentEl.onmousedown = function(e){
        mz ++;
        that.nodeParentEl.style.zIndex = mz.toString();

        //this.style.backgroundColor = "#84acac";

        if(e.ctrlKey){
            addSelectedNode(that);
        }

    }

    

    this.nodeParentEl.onmouseup = function(){
        //this.style.backgroundColor = "#6e6e6e";
        
        
    }


    // Initialize position
    this.moveTo({x: pos.x, y: pos.y});

    // Initialize jqueryui functions
    this.initNodeUi();
}




// Add new input to node
Node.prototype.addInput = function(input){
    var newInput = new NodeInput(input, this);
    newInput.owner = this;

    this.inputs.push(newInput);

    if(this.inputs.length == 1 && this.outputs.length == 1){
        this.outputs[0].nodeOutputEl.style.top = "0%";
    }
    else if(this.inputs.length == 2 && this.outputs.length == 1){
        this.outputs[0].nodeOutputEl.style.top = "25%";
    }

    this.nodeBody.appendChild(newInput.nodeInputEl);
}

// Add new output to node
Node.prototype.addOutput = function(input){
    var newOutput = new NodeOutput(input, this);
    newOutput.owner = this;

    this.outputs.push(newOutput);

    this.nodeBody.appendChild(newOutput.nodeOutputEl);
}

Node.prototype.updatePaths = function(){
    var nInputs = this.inputs.length;

    for(let i = 0; i < this.inputs.length; i++){
        if(this.inputs[i].connectedOutput != null && this.inputs[i].path != null){
            var inPoint = this.inputs[i].getInputOffset();
            var outPoint = this.inputs[i].connectedOutput.getOutputOffset();
            
            var svgPath = createPath(outPoint, inPoint);
            this.inputs[i].path.setAttributeNS(null, 'd', svgPath);
        }
    }
    
    for(let i = 0; i < this.outputs.length; i++){
        for(let j = 0; j < this.outputs[i].connectedInputs.length; j++){

            var inPoint = this.outputs[i].connectedInputs[j].getInputOffset();
            var outPoint = this.outputs[i].getOutputOffset();
            
            var svgPath = createPath(outPoint, inPoint);
            this.outputs[i].connectedInputs[j].path.setAttributeNS(null, 'd', svgPath);
        }
            
    }
}


// Update node location
Node.prototype.moveTo = function(point){
    this.nodeParentEl.style.top = point.y + 'px';
    this.nodeParentEl.style.left = point.x + 'px';
    //this.updatePosition();
};

Node.prototype.initNodeUi = function(){
    var that = this;
    
    $(this.nodeParentEl).draggable({
        containment: 'window',
        cancel: '.nodeInput,.nodeOutput, .constant',
        drag: function(event, ui){
        that.updatePaths();
        hoverNode = that;
        }
        
    });
    
    //this.updatePosition();
    this.nodeParentEl.style.position = 'absolute';
    document.body.appendChild(this.nodeParentEl);
};
















function NodeInput(input){
    var that = this;

    this.name = input.name;
    this.type = input.type;


    if(input.type == "Number")
        this.value = 0;
    else if(input.type == "Vec2")
        this.value = {x: 0, y: 0};

   
   
    this.owner = null;
    this.isConnected = false;
    this.connectedOutput = null;
    this.path = null;

    this.isDirty = false;

    this.nodeInputEl = document.createElement('div');
    this.nodeInputEl.innerHTML = this.name;

    if(input.hasConnector)
        this.nodeInputEl.classList.add('nodeInput');
    else
        this.nodeInputEl.classList.add('constant');

    if(input.inputBox){
        this.inputBox = document.createElement('INPUT');
        this.inputBox.classList.add('nodeInputBox');
        this.inputBox.setAttribute("type", "text");
        this.inputBox.setAttribute("value", this.value);
        
        this.inputBox.addEventListener('change', function(){ 
            that.value = parseFloat(this.value);
            that.owner.evaluate(that.owner);
            that.isDirty = false;

            if(that.owner.canvas){
                clearAllGraphNodes();
            }
        });

        this.nodeInputEl.appendChild(this.inputBox);
    }

    this.nodeInputEl.onmousedown = function(){
        mouse.dragging = true;
        selectedInput = that;

        if(that.connectedOutput != null)
            that.disconnect(that.connectedOutput);

    }

    this.nodeInputEl.onmouseup = function(){
        mouse.dragging = true;
        selectedInput = that;

        if(selectedOutput != null){
            selectedOutput.connect(selectedInput);
            selectedOutput = null;
            selectedInput = null;
        }

    }


}

NodeInput.prototype.getInputOffset = function(){
    var offset = getOffset(this.nodeInputEl);
    
    return {
        x: offset.left - 12,
        y: offset.top + this.nodeInputEl.offsetHeight / 2 - 2
    };

};


NodeInput.prototype.disconnect = function(output){
    if(this.connectedOutput != null){
        removePath(this);
        
        let index = output.connectedInputs.indexOf(this);
        output.connectedInputs.splice(index, 1);

        console.log("Disconnected input '" + this.name + "' of node '" + this.owner.name + "' from output '" + output.name + "' of node '" + output.owner.name + "' ");
    }
}
















function NodeOutput(output){
    var that = this;

    this.name = output.name;
    this.type = output.type;

    if(output.type == "Number")
        this.value = 0;
    else if(output.type == "Vec2")
        this.value = {x: 0, y: 0};

    this.owner = null;
    this.connectedInputs = [];

    this.nodeOutputEl = document.createElement('div');
    this.nodeOutputEl.classList.add('nodeOutput');
    this.nodeOutputEl.innerHTML = this.name;

    this.nodeOutputEl.onmousedown = function(){
        mouse.path = makePath(that.getOutputOffset(), that.getOutputOffset());
        mouse.dragging = true;
        selectedOutput = that;
    }

}




NodeOutput.prototype.getOutputOffset = function(){
    var tmp = this.nodeOutputEl;
    var offset = getOffset(tmp);
    
    return {
        x: offset.left + tmp.offsetWidth / 2 + 35,
        y: offset.top + tmp.offsetHeight / 2
    };
};




NodeOutput.prototype.connect = function(input){
    if(this.type == input.type){

        // Set this inputs connected output
        input.connectedOutput = this;

        // Set the value of the input to the calue of the output
        input.value = this.value;

        // Add this input to the outputs connected inputs
        this.connectedInputs.push(input);

        // Input is dirty
        input.isDirty = true;

        // Hide the input box if there is one
        if(input.inputBox)
            input.inputBox.style.display = "none";


        input.path = makePath(input.getInputOffset(), this.getOutputOffset(), this);

        console.log("Connected output '" + this.name + "' of node '" + this.owner.name + "' to input '" + input.name + "' of node '" + input.owner.name + "' ");
    }
    else{
        console.log("Input type does not match the output.");
    }
}
