const pi2 = 6.283;

function log(x){return console.log(x);}

// Math functions
function cos(x){return Math.cos(x);}
function sin(x){return Math.sin(x);}
function mod(a, b){return a % b;}
function fract(x){return Math.fract(x);}
function floor(x){return Math.floor(x);}
function ceil(x){return Math.ceil(x);}
function min(a, b){return Math.min(a, b);}
function max(a, b){return Math.max(a, b);}
function clamp(x, a, b){return min(max(x, a), b);}
function abs(x){return Math.abs(x);}
function exp(x){return Math.exp(x);}
function sqrt(x){return Math.sqrt(x);}
function pow(a, b){return Math.pow(a, b);}
function rand(){return Math.random();}

function smoothstep(e0, e1, x){
    x = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
    return x * x * (3 - 2 * x);
}

