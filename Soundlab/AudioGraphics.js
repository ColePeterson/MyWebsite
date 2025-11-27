

//var canvas2 = document.getElementById("canvas")
//var ctx2 = canvas2.getContext("2d");



function clearCanvas (canvas) {
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(150, 150, 150)";
    //ctx.fillStyle = "rgb(" + (Math.random() * 255).toString() + "," + (Math.random() * 255).toString() + "," + (Math.random() * 255).toString() + ")";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}


var padding = 8;
var tickSize = 1111;

function drawLines (canvas) {
    var ctx = canvas.cnvs.getContext("2d");
    
    var height = canvas.cnvs.height - padding*2;
    var width = canvas.cnvs.width - padding*2;

    ctx.strokeStyle = "rgb(50, 50, 50)";
   
    ctx.font = "bold 16px Arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;


    // Y axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.cnvs.height - padding);

    // X axis
    ctx.moveTo(padding, (canvas.cnvs.height/2));
    ctx.lineTo(canvas.cnvs.width - padding, (canvas.cnvs.height/2));

    // Padding box
    ctx.moveTo(padding, padding);
    ctx.lineTo(canvas.cnvs.width - padding,  padding);

    ctx.moveTo(canvas.cnvs.width - padding, padding);
    ctx.lineTo(canvas.cnvs.width - padding,  canvas.cnvs.height - padding);

    ctx.moveTo(padding, canvas.cnvs.height - padding);
    ctx.lineTo(canvas.cnvs.width - padding,  canvas.cnvs.height - padding);

    ctx.fillStyle = "rgb(0, 0, 0)";
    
    // X ticks / numbers
    for(i = 0; i < canvas.scale*2; i++){
        let posX = (i / canvas.scale) * (width*0.5);

        ctx.moveTo(posX + padding, (canvas.cnvs.height/2) - tickSize);
        ctx.lineTo(posX + padding, (canvas.cnvs.height/2) + tickSize);

       if(i != 0)
            ctx.fillText(i, posX + padding - ctx.measureText(i).width/2, (canvas.cnvs.height/2) + 20);
    }   

    
    // Y ticks / numbers
    for(i = -canvas.scale + 1; i < canvas.scale; i++){
        let posY = (height/2) - (i / canvas.scale) * height/2;

        ctx.moveTo(padding + tickSize, posY + padding);
        ctx.lineTo(padding - tickSize, posY + padding);

        if(i != 0)
            ctx.fillText(i, padding + 5, posY + 5 + padding);
    }

    ctx.stroke();
}


function drawFunction(canvas, x, y){
    var ctx = canvas.getContext("2d");
    
    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.shadowBlur = 0;
    
    ctx.fillRect(x, y, 1,1);
    ctx.fill();
    
}





window.onload = function () 
{
	//clearCanvas(canvas2);
}

