var baseFreq = 110.0; // A2		// frequency of octave represented by keyboard
var root = pow(2.0, 1.0 / 12.0);	

// Audio helper functions
function distort(input, level){
    input.l = clamp(input.l * level, -1.0, 1.0);
    input.r = clamp(input.r * level, -1.0, 1.0);
}

function linearEnvelope(attack, sustain, release, time){
    var a = time * (1.0 / attack);
    var b = (-time + sustain + attack + release) * (1.0 / release);
    return max(min(min(a, 1.0), b), 0.0);
}

function easeIn(time, k){
    return -exp(-time*k) + 1.0;
}


function sineWave(time, hz){
    return sin(time*pi2*hz);
}

function squareWave(time, hz){
    let sum = 0.0;
    for(let i = 1; i <= 20; i++){
        sum += (4.0 / 3.14159) * (sin(pi2 *(2.0*i - 1.0)*time*hz)) / (2.0*i - 1.0);
    }
    return sum;
}

function sawTooth(time, hz){
    var s = 0.0;
    for(var i = 0; i < 20; i++){
        s += sineWave(time, hz*(i+1.0)) / (i + 1.0); 
    }
    return s;
}