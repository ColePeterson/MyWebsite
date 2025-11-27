
var ps = 0;
var rs = 0;
var ChangeRes = 0;

var lW = 1200;
var lH = 675;


function RestartShader()
{
	rs = 1;
}


function PlayPauseShader() 
{
	if(ps == 0)
	{
		document.getElementById("btn0").style.color = "green";
		document.getElementById("btn0").innerHTML = "Play";
		ps = 1;
	}
	else if(ps == 1)
	{
		document.getElementById("btn0").style.color = "red";
		document.getElementById("btn0").innerHTML = "Pause";
		ps = 0;
	}
	
	return p;
}




function Framebuffer (gl, n, type, w, h=w) 
{
	this.gl = gl;
	this.type = type;
	this.n = n;
	this.w = w;
	this.h = h;
	this.width = w;
	this.height = h;
	this.fbo = gl.createFramebuffer();
	this.renderbuffer = gl.createRenderbuffer();
	this.texture = gl.createTexture();
	gl.activeTexture(gl['TEXTURE' + this.n]);
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, this.type, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

	this.write = function (typedArray) 
	{
		var gl = this.gl;
		gl.activeTexture(gl["TEXTURE" + this.n]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, this.type, typedArray);
	}

	this.source = function (element) 
	{
		var gl = this.gl;
		gl.activeTexture(gl["TEXTURE" + this.n]);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	}

    this.route = function () 
	{
        gl.activeTexture(gl["TEXTURE"+this.n]);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER,  this.fbo);
	    gl.viewport(0,0,this.w,this.h);
	}
}



function createProgram (gl, vstr, fstr) 
{
    if (vstr.length < 50) vstr = document.getElementById(vstr).textContent;
    if (fstr.length < 50) fstr = document.getElementById(fstr).textContent;
	var program = gl.createProgram(),
		vshader = createShader(gl, vstr, gl.VERTEX_SHADER),
		fshader = createShader(gl, fstr, gl.FRAGMENT_SHADER);
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw gl.getProgramInfoLog(program);
	}
	return program;
}

function createShader (gl, str, type) 
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert(gl.getShaderInfoLog(shader)+str);
		throw gl.getShaderInfoLog(shader);
	}
	return shader;
}
	
	
function initAttrib (gl, program) 
{
    gl.useProgram(program);
    var attrib = gl.getAttribLocation(program, 'av');
    gl.enableVertexAttribArray(attrib);
    gl.vertexAttribPointer(attrib, 2, gl.FLOAT, gl.FALSE, 0, 0);
    return initAttrib;
}
	

function setUni (gl, program, name, args, int = false) 
{
    gl.useProgram(program);
    if (!program[name]) program[name] = gl.getUniformLocation (program, name);
    if (int || typeof(args) == "boolean") gl.uniform1i(program[name], args);
    else if (args.constructor == Array) gl["uniform" + args.length + "fv"](program[name], args);
    else if (typeof(args) == "number") gl.uniform1f(program[name], args);
	else if (args.constructor == Framebuffer) gl.uniform1i(program[name], args.n);
    return setUni;
	
}
	
	
function draw (gl, program, dest=false, type=gl.TRIANGLES, a=0, b=6, clear = true) 
{
        gl.useProgram (program);

        if (dest){
			dest.route();
		}
		else 
		{
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        if (clear) 
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(type,a,b);
}


function renderToFrameBuffer(gl, program, dest){
	gl.useProgram(program);

	if(dest){
		dest.route2();
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	
}

		
function initVerts (gl, w=0, h=w) 
{
    var arr = new Float32Array(w*h*2+12),sqr = [0,0,1,0,0,1, 1,1,1,0,0,1], i = 0;
	for (j = 0; j < 12; j++) arr[i++] = sqr[j];
	for (var y = 0; y < h; y ++) 
	{
		for (var x = 0; x < w; x ++) 
		{
			arr[i++] = x/w;
			arr[i++] = y/h;
		}
	}
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
	return arr;
} 



function resize(canvas) 
{
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 

  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}





window.onload = function () 
{
	var canvas = document.getElementById("canvas");

    //canvas.width = 400;
    //canvas.height = 100;

	var gl = canvas.getContext("webgl");
	var verts = initVerts (gl);
	var programImage = createProgram (gl, "vs", "fs");

	var ext = gl.getExtension('OES_texture_float');
	var lin = gl.getExtension('OES_texture_float_linear');

	var fboImage = new Framebuffer (gl, 0, gl.FLOAT, canvas.width, canvas.height);

	initAttrib (gl, programImage);
	

	setUni (gl, programImage, "resolution", [canvas.width, canvas.height]);
	setUni (gl, programImage, "mouse", [0, 0]);
	setUni (gl, programImage, "MouseButton", 0);
	
	var m = [];

	canvas.addEventListener('mousemove', function(event) 
    {
        var rect = canvas.getBoundingClientRect();
        m[0] = event.clientX - rect.left;
        m[1] = event.clientY - rect.top;
        
        m[1] = m[1] * -1. + rect.height;
        
        setUni (gl, programImage, "mouse", m);
    }, false);


	canvas.addEventListener('mousedown', function(event) 
    {
        setUni (gl, programImage, "MouseButton", 1);

    }, false);


	canvas.addEventListener('mouseup', function(event) 
    {
        setUni (gl, programImage, "MouseButton", 0);

    }, false);

	var t = 0;
	
	function animate () {
		requestAnimationFrame (animate);
		
		resize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		
		if(rs == 1)
		{
			t = 0;
			rs = 0;
		}
		if(ChangeRes == 1)
		{
			delete fboImage;

			fboImage = new Framebuffer (gl, 0, gl.FLOAT, canvas.width, canvas.height);

			setUni (gl, programImage, "resolution", [canvas.width,  canvas.height]);

			ChangeRes = 0;

			console.log("Changed resolution");
		}
		
		
		
		if(ps == 0)
			setUni (gl, programImage, "time", t++);
		else if(ps == 1)
			setUni (gl, programImage, "time", t);
		
		
		

		draw (gl, programImage);
		
		
		//document.getElementById("timer").innerHTML = t;
	}
	
	animate ();
	

}