var mz = 1;

var svg = document.getElementById('svg');
svg.ns = svg.namespaceURI;


var selectedInput = null;
var selectedOutput = null;

var boxSelect = {x: 0, y: 0, w: 0, h: 0, selecting: false, path: 0}; 

var mouse = {x: 0, y: 0, down: false, dragging: false, selectedInput: null, selectedOutput: null, path: null};

var selectedNodes = [];

var hoveringOnNode = false;
var hoverNode = null;

var testPos = {x: 0, y: 0};

function clearSelectedNodes(){
    for(let i = 0; i < selectedNodes.length; i++){
        selectedNodes[i].nodeParentEl.style.backgroundColor = "#6e6e6e";
        selectedNodes[i].isSelected = false;
    }
    selectedNodes = [];
}

function addSelectedNode(node){
    let bounds = node.nodeParentEl.getBoundingClientRect();

    node.nodeParentEl.style.backgroundColor = "#84acac";
    node.isSelected = true;
    node.ix = bounds.right;
    node.iy = bounds.bottom;

    selectedNodes.push(node);

    
}

//at: "left " + String(selectedNodes[i].ix) + "bottom " + String(selectedNodes[i].iy),
//my: "left+33 bottom-33",

$( document ).mousemove(function( event ) {

    if(hoveringOnNode && mouse.down){
        for(let i = 0; i < selectedNodes.length; i++){

            
            let strng = "left:" + selectedNodes[i].ix + "bottom:" + selectedNodes[i].iy;
            //console.log(strng);
            console.log(selectedNodes[i].ix);
            $( selectedNodes[i].nodeParentEl ).position({
                
                at: strng,
                
                of: event
            });
            

        }
    }
});

function makePath(inPoint, outPoint, el){
    var newPath = document.createElementNS(svg.ns, 'path');
    newPath.setAttributeNS(null, 'stroke', '#8e8e8e');
    newPath.setAttributeNS(null, 'stroke-width', '2');
    newPath.setAttributeNS(null, 'fill', 'none');
    
    var svgPath = createPath(outPoint, inPoint);
    newPath.setAttributeNS(null, 'd', svgPath);
    svg.appendChild(newPath);

    return newPath;
}


function removePath(el){
    el.path.removeAttribute('d');
    el.path = null;
    el.connectedOutput = null;
}

function createPath(a, b){
    var diff = {
        x: b.x - a.x,
        y: b.y - a.y
    };
      
    var pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;
      
    return pathStr;

}



function updateSinglePath(inPoint, outPoint, el){
    var svgPath = createPath(outPoint, inPoint);
    el.path.setAttributeNS(null, 'd', svgPath);
}



document.body.onmousemove = function (e) {
    getMousePos(e);
    
    if(mouse.dragging && selectedOutput){
        updateSinglePath(selectedOutput.getOutputOffset(), {x:mouse.x, y:mouse.y}, mouse);
    }
    if(boxSelect.selecting){
        //updateSinglePath
    }

    //moveselectedNodes(e);


}

document.body.onmousedown = function (e) {
    mouse.down = true;
    
}

function getMousePos(e) {
	mouse.x = e.clientX;
    mouse.y = e.clientY;
}



document.body.onmouseup = function (e) {
    mouse.down = false;
    mouse.dragging = false;
    boxSelect.selecting = false;

    if(mouse.path)
        removePath(mouse);
}




function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function getOffset(el){
    var rect = el.getBoundingClientRect();

    var position = {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };

    return position;
}