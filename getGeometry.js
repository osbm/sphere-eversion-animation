import * as THREE from 'three';
import { TwoJet, ThreeJet, TwoJetVec, ThreeJetVec } from './jets.js';



function sqr (x) {
    return x * x;
}

function calcSpeedV(v) {
    return Math.sqrt(sqr(v.x.df_dv()) + sqr(v.y.df_dv()) + sqr(v.z.df_dv()));
}

function calcSpeedU(u) {
    return Math.sqrt(sqr(u.x.df_du()) + sqr(u.y.df_du()) + sqr(u.z.df_du()));
}


function FFInterp(x, FFPOW=3) { // What the fuck
    x %= 2;
    if (x > 2)
        x = x * (-1) + 2;
    x = x*1.06 + - 0.03;
    if (x < 0)
        return ThreeJet(0,0,0);
    else if (x < 1)
        return ThreeJet(0,0,0) + 1;
    else
        return (x ^ (FFPOW-1)) * (FFPOW) + (x^FFPOW) * (-FFPOW+1);
}

function FSInterp (x, FSPOW=3) {
    x %= 2;
    if (x > 1)
        x = x*(-1) + 2;
    return ((x ^ (FSPOW-1)) * (FSPOW) + (x^FSPOW) * (-FSPOW+1)) * (-0.2);
}


function TInterp (x) { // unnecessary function
    return new ThreeJet(x, 0, 0)
}

function FigureEight(w, h, bend, form, v) { // returns TwoJetVec
    var height; // TwoJet
    v %= 1;

    height = (Cos(v*2) - 1) * -1 ;
    if (v > 0.25 && v < 0.75) {
        height = height * -1 + 4;
    }

    height = height*0.6;
    h = h + bend*(height*height*(1/64.0));
    return w*Sin (v*2) + (h) * (Interpolate((Cos (v) - 1) * (-2), height, form));
}



function AddFigureEight( // returns TwoJetVec , also what the fuck
    p,          // ThreeJetVec
    u,          // ThreeJet
    v,          // TwoJet
    form,       // ThreeJet
    scale,      // ThreeJet
    num_strips, // int
) {

    var size = form * scale; // ThreeJet
    form = form*2 + form*form-1;
    var dv = AnnihilateVec(D(p, 1), 1); // TwoJetVec
    p = AnnihilateVec(p, 1);

    var du = Normalize(D(p, 0)); // TwoJetVec

    var h = Normalize(Cross(du, dv))*TwoJet(size); // TwoJetVec
    var w = Normalize(Cross(h, du))* (TwoJet(size) * 1.1); // TwoJetVec
    return RotateZ(
        TwoJetVec(p) + FigureEight(w, h, du*D(size, 0)*(D(u, 0)^(-1)), form, v),
        v*(1.0/num_strips)
    )
}

function Arc (u, v, xsize, ysize, zsize) {
    var result = new ThreeJetVec();

    u = u * 0.25; // or dividing by 4 ?
    result.x = Math.sin (u) * Math.sin (v) * xsize;
    result.y = Math.sin (u) * Math.cos (v) * ysize;
    result.z = Math.cos (u) * zsize;
    return result;
}


function Stage1 (u, v) { // unnecessary wrapper 
    return Arc(u,v, 1, 1, 1)
}

function Corrugate(u, v, time, num_strips) { // returns TwoJetVec
    var tmp = TInterp(time); // returns ThreeJet
    var t = tmp.f;

    return AddFigureEight(
        Stage1(u, new ThreeJet(0, 0, 1)),
        u, v, FFInterp(u) * new ThreeJet(t,0,0), FSInterp(u),
        num_strips
    )

}


function calculate_geometry_array(func, geometry, time, u_min, u_max, u_count, v_min, v_max, v_count, num_strips) {
    var j, k, u, v, delta_u, delta_v;
    var values = [];

    if (u_count <= 0 || v_count <= 0)
        return;

    delta_u = (u_max - u_min) / u_count;
    delta_v = (v_max - v_min) / v_count;

    var speedv = [];
    var speedu = []; // this is not getting used i think maybe its ok to remove it?

    for (j = 0; j <= u_count; j++) {
        u = u_min + j*delta_u;
        values[j] = [];
        speedu[j] = [];
        speedv[j] = calcSpeedV(func(new ThreeJet(u, 1, 0), new ThreeJet(0, 0, 1), time, num_strips));
        
        if (speedv[j] == 0) {
            u += (u < 1) ? 1e-9 : -1e-9;
            speedv[j] = calcSpeedV(func(new ThreeJet(u, 1, 0), new ThreeJet(0, 0, 1), time, num_strips));
        }

        for (k = 0; k <= v_count; k++) {
            v = v_min + k*delta_v;
            values[j][k] = func(new ThreeJet(u, 1, 0), new ThreeJet(v, 0, 1), time, num_strips);
            speedu[j][k] = calcSpeedU(values[j][k]);
        }
    }



}


export function getGeometry(time=0, radius=5, number_of_segments=32, number_of_rings=32, num_strips=8, u_min=0, u_max=1, u_count=12, v_min=0, v_max=1, v_count=12) {
    if ((0.0 > time) && (time > 1.0)) {
        console.log("Error: time must be between 0 and 1");
        // raise error
        throw "Error: time must be between 0 and 1";
    }

    var geometry = new THREE.SphereGeometry(radius, number_of_segments, number_of_rings);



    if ((time => 0.0) && (time <= 0.1)) { // corrugation
        geometry_array = calculate_geometry_array(
            Corrugate,
            geometry,
            (time - 0.0) / (0.1 - 0.0),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.1) && (time <= 0.23)) { // Push
        geometry_array = calculate_geometry_array(
            push,
            geometry,
            (time - 0.1) / (0.23 - 0.1),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.23) && (time <= 0.6)) { // Twist
        geometry_array = calculate_geometry_array(
            twist,
            geometry,
            (time - 0.23) / (0.6 - 0.23),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.6) && (time <= 0.93)) { // Unpush
        geometry_array = calculate_geometry_array(
            unpush,
            geometry,
            (time - 0.6) / (0.93 - 0.6),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.93) && (time <= 1.0)) { // Uncorrugate
        geometry_array = calculate_geometry_array(
            uncorrugate,
            geometry,
            (time - 0.93) / (1.0 - 0.93),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else {
        console.log("Error: time must be between 0 and 1");
        // raise error
        throw "Error: time must be between 0 and 1";
    }


    geometry.setAttribute('position', new THREE.BufferAttribute(geometry_array, 3));
    return geometry;

}

