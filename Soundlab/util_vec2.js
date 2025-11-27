

function vec2(x, y = "NULL"){
    if(y == "NULL")
        return {l:x, r:x};
    else
        return {l:x, r:y};
}

function setVec2(a, lft, rgt = "NULL"){
    if(rgt == "NULL"){
        a.l = lft;
        a.r = lft;
    }
    else{
        a.l = lft;
        a.r = rgt;
    }
}

function vec2PlusScalar(s, a, b = "NULL"){
    if(b == "NULL"){
        s.l = s.l + a;
        s.r = s.r + a;
    }
    else{
        s.l = s.l + a;
        s.r = s.r + b;
    }
}

function vec2PlusVec2(s, a){
    s.l = s.l + a.l;
    s.r = s.r + a.r;
}

function vpss(s, x, a, b = "NULL"){
    if(b == "NULL"){
        s.l = s.l + a*x;
        s.r = s.r + a*x;
    }
    else{
        s.l = s.l + a*x;
        s.r = s.r + b*x;
    }
}

function vpvs(s, a, x){
    s.l = s.l + a.l*x;
    s.r = s.r + a.r*x;
}

function addsVec2(s, vol, a, b = "NULL"){
    if(b == "NULL"){
        s.l = s.l + a * vol;
        s.r = s.r + a * vol;
    }
    else{
        s.l = s.l + a * vol;
        s.r = s.r + b * vol;
    }
}

function scaleVec2(a, scale){
    a.l = a.l*scale;
    a.r = a.r*scale;
}
function divideVec2(a, scale){
    a.l = a.l/scale;
    a.r = a.r/scale;
}



function smoothClampVec2(s){
    s.l = 1 - exp(-s.l);
    s.r = 1 - exp(-s.r);
}

function linearEnvelopeVec2(sound, attack, sustain, release, time){
    let env = linearEnvelope(attack, sustain, release, time);
    sound.l *= env;
    sound.r *= env;
}

function smoothstepVec2(sound, e0, e1, x){
    let ss = smoothstep(e0, e1, x);
    sound.l *= ss;
    sound.r *= ss;
}












