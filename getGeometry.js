// import * as THREE from 'three';
import { TwoJet, ThreeJet, TwoJetVec, ThreeJetVec } from './jets.js';


function FigureEight(w, h, bend, form, v) { // returns TwoJetVec
    v = v.operatorModulo(1);

    var height = v.operatorMultiplyScalar(2).operatorCos().operatorPlusScalar(-1).operatorMultiplyScalar(-1);
    if (v.f > 0.25 && v.f < 0.75) {
        height = height.operatorMultiplyScalar(-1).operatorPlusScalar(4);
    }
    height = height.operatorMultiplyScalar(0.6);

    h = h.operatorPlus(bend.operatorMultiply(height.operatorMultiply(height).operatorMultiplyScalar(1/64)));

    const term1 = w.operatorMultiply(v.operatorMultiplyScalar(2).operatorSin());
    const term2 = h.operatorMultiply(v.operatorCos().operatorPlusScalar(-1).operatorMultiplyScalar(-2).interpolate(height, form));

    return term1.operatorPlus(term2);
}

function AddFigureEight(
    p,         // ThreeJetVec
    u,         // ThreeJet
    v,         // TwoJet
    form,      // ThreeJet
    scale,     // ThreeJet
    num_strips // int
) {
    var size = form.operatorMultiply(scale); // ThreeJet
    form = form.operatorMultiplyScalar(2).operatorPlus(form.operatorMultiply(form).operatorMultiplyScalar(-1));
    var dv = p.derivative_vec(1).annihilate_vec(1); // TwoJetVec
    p = p.annihilate_vec(1);
    var du = p.derivative_vec(0).normalize(); // TwoJetVec
    var h = du.cross(dv).normalize().operatorMultiply(size.get_two_jet()); // TwoJetVec
    var w = h.cross(du).normalize().operatorMultiply(size.get_two_jet().operatorMultiplyScalar(1.1)); // TwoJetVec

    var figure_eight = FigureEight(
        w,
        h,
        du.operatorMultiply(size.derivative(0)).operatorMultiply(u.derivative(0).operatorPower(-1)),
        form,
        v
    ); // TwoJetVec

    return p.operatorPlus(figure_eight).rotate_z(v.operatorMultiplyScalar(1/num_strips));
}

function Arc(u, v, xsize, ysize, zsize) { // returns ThreeJetVec
    u = u.operatorMultiplyScalar(0.25);

    return new ThreeJetVec(
        u.operatorSin().operatorMultiply(v.operatorSin()).operatorMultiplyScalar(xsize),
        u.operatorSin().operatorMultiply(v.operatorCos()).operatorMultiplyScalar(ysize),
        u.operatorCos().operatorMultiplyScalar(zsize)
    );
}

function Straight (u, v, xsize, ysize, zsize) { // returns ThreeJetVec
    u = u.operatorMultiplyScalar(0.25);

    return new ThreeJetVec(
        v.operatorSin().operatorMultiplyScalar(xsize),
        v.operatorCos().operatorMultiplyScalar(ysize),
        u.operatorCos().operatorMultiplyScalar(zsize)
    );
}

function Param1(x) {
    var offset = 0;
    x = x.operatorModulo(4);
    if (x.f > 2) {
        x = x.operatorPlusScalar(-2);
        offset = 2;
    }
    if (x.f <= 1) {
        return x.operatorMultiplyScalar(2).operatorPlus(x.operatorPower(2).operatorMultiplyScalar(-1)).operatorPlusScalar(offset); // x*2 + (x^2)*(-1) + offset;
    } else {
        return x.operatorPower(2).operatorPlus(x.operatorMultiplyScalar(-2)).operatorPlusScalar(2 + offset); // (x^2) + x*(-2) + (2 + offset)
    }
}

function Param2(x) {
    var offset = 0;
    x = x.operatorModulo(4);

    if (x.f > 2) {
        x = x.operatorPlusScalar(-2);
        offset = 2;
    }

    if (x.f <= 1) {
        return x.operatorPower(2).operatorPlusScalar(offset); // (x^2) + offset
    } else {
        // (x^2)*(-1) + x*4 + (-2 + offset)
        return x.operatorPower(2).operatorMultiplyScalar(-1).operatorPlus(x.operatorMultiplyScalar(4)).operatorPlusScalar(-2 + offset);
    }
}

function TInterp(x) {
    return new ThreeJet(x, 0, 0);
}

function UInterp(x) {
    x = x.operatorModulo(2);

    if (x.f > 1) {
        x = x.operatorMultiplyScalar(-1).operatorPlusScalar(2);
    }

    return x.operatorPower(2).operatorMultiplyScalar(3).operatorPlus(x.operatorPower(3).operatorMultiplyScalar(-2)); // (x^2)*3 + (x^3) * (-2);
}

function FFInterp(x) {
    var FFPOW = 3;
    x = x.operatorModulo(2);
    if (x.f > 2) {
        x = x.operatorMultiplyScalar(-1).operatorPlusScalar(2);
    }
    x = x.operatorMultiplyScalar(1.06).operatorPlusScalar(-0.03);
    if (x.f < 0) {
        return new ThreeJet(0, 0, 0);
    } else if (x.f > 1) {
        return new ThreeJet(0, 0, 0).operatorPlusScalar(1);
    } else {
        return x.operatorPower(FFPOW - 1).operatorMultiplyScalar(FFPOW).operatorPlus(x.operatorPower(FFPOW).operatorMultiplyScalar(-FFPOW + 1)); // (x ^ (FFPOW-1)) * (FFPOW) + (x^FFPOW) * (-FFPOW+1)
    }
}

function FSInterp(x) {
    var FSPOW = 3;
    x = x.operatorModulo(2);
    if (x.f > 1) {
        x = x.operatorMultiplyScalar(-1).operatorPlusScalar(2);
    }
    return x.operatorPower(FSPOW - 1).operatorMultiplyScalar(FSPOW).operatorPlus(x.operatorPower(FSPOW).operatorMultiplyScalar(-FSPOW + 1)).operatorMultiplyScalar(-0.2); // ((x ^ (FSPOW-1)) * (FSPOW) + (x^FSPOW) * (-FSPOW+1)) * (-0.2);
}

function Stage0(u, v) {
    return Straight(u, v, 1, 1, 1);
}

function Stage1(u, v) {
    return Arc(u, v, 1, 1, 1);
}

function Stage2(u, v) {
    var arc_one = Arc(Param1(u), v, 0.9, 0.9, -1);
    var arc_two = Arc(Param2(u), v, 1, 1, 0.5);
    return arc_one.interpolate_vec(arc_two, UInterp(u));
}

function Stage3(u, v) {
    var arc_one = Arc(Param1(u), v, -0.9, -0.9, -1);
    var arc_two = Arc(Param2(u), v, -1, 1, -0.5);
    return arc_one.interpolate_vec(arc_two, UInterp(u));
}

function Stage4(u, v) {
    return Arc(u, v, -1, -1, -1);
}

function Scene01(u, v, time) {
    return Stage0(u, v).interpolate_vec(Stage1(u, v), TInterp(time));
}

function Scene12(u, v, time) {
    return Stage1(u, v).interpolate_vec(Stage2(u, v), TInterp(time));
}

function Scene23(u, v, time) {
    var tmp = TInterp(time);
    var t = tmp.f * 0.5; // what the fuck ?? whyyy

    // double tt = (u <= 1) ? t : -t;
    var tt = (u.f <= 1) ? t : -t;

    var vector_one = Arc(Param1(u), v, 0.9, 0.9,-1).rotate_z(new ThreeJet(tt, 0, 0))
    var vector_two = Arc(Param2(u), v, 1, 1, 0.5).rotate_y(new ThreeJet(t, 0, 0))

    return vector_one.interpolate_vec(vector_two, UInterp(u))
}

function Scene34(u, v, time) {
    return Stage3(u, v).interpolate_vec(Stage4(u, v), TInterp(time));
}

function BendIn(u, v, time, num_strips) {
    var tmp = TInterp(time);
    var t = tmp.f; // unnecessary

    return AddFigureEight(
        Scene01(u, ThreeJet(0, 0, 1), t),
        u, v, ThreeJet(0,0,0), FSInterp(u),
        num_strips,
    )
}

function Corrugate(u, v, t, num_strips) {
    var tmp = TInterp(t)
    t = tmp.f;

    return AddFigureEight(
        Stage1(u, new ThreeJet(0,0,1)),
        u, v, FFInterp(u).operatorMultiply(new ThreeJet(t, 0, 0)), FSInterp(u),
        num_strips
    )
}

function PushThrough(u, v, t, num_strips) {
    return AddFigureEight(
        Scene12(u, new ThreeJet(0,0,1), t),
        u, v, FFInterp(u), FSInterp(u),
        num_strips
    )
}

function Twist(u, v, t, num_strips) {
    return AddFigureEight(
        Scene23(u, new ThreeJet(0,0,1), t),
        u, v, FFInterp(u), FSInterp(u),
        num_strips
    )
}

function Unpush(u, v, t, num_strips) {
    return AddFigureEight(
        Scene34(u, new ThreeJet(0,0,1), t),
        u, v, FFInterp(u), FSInterp(u),
        num_strips
    )
}

function UnCorrugate(u, v, t, num_strips) {
    var tmp = TInterp(t* (-1) + 1);
    t = tmp.f;

    return AddFigureEight(
        Stage4(u, new ThreeJet(0,0,1)),
        u, v, FFInterp(u).operatorMultiply(new ThreeJet(t, 0, 0)), FSInterp(u),
        num_strips
    )
}

function sqr(x) {
    return x * x;
}
  
function calcSpeedV(v) {
    return Math.sqrt(sqr(v.x.fv) + sqr(v.y.fv) + sqr(v.z.fv));
}

function calcSpeedU(u) {
    return Math.sqrt(sqr(u.x.fu) + sqr(u.y.fu) + sqr(u.z.fu));
}


function calculate_geometry_array(func, time, u_min, u_max, u_count, v_min, v_max, v_count, num_strips) {
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

    // let coordinates = [
    //     {
    //       x : 1,
    //       y : 1,
    //       z: 10
        // },
    
    //  turn the values into 1d array of dictionaries
    //  each dictionary has x, y, z
   
    var coordinates = [];
    for (j = 0; j <= u_count; j++) {
        for (k = 0; k <= v_count; k++) {
            coordinates.push({
                x: values[j][k].x.f,
                y: values[j][k].y.f,
                z: values[j][k].z.f
            });
        }
    }


    return coordinates; // 13 x 13 x 3

}


function getGeometry(time=0, num_strips=8, u_min=0, u_max=1, u_count=12, v_min=0, v_max=1, v_count=12) {
    if ((0.0 > time) && (time > 1.0)) {
        console.log("Error: time must be between 0 and 1");
        // raise error
        throw "Error: time must be between 0 and 1";
    }

    // var geometry = new THREE.SphereGeometry(radius, number_of_segments, number_of_rings);

    var geometry_array;

    if ((time => 0.0) && (time <= 0.1)) { // corrugation
        geometry_array = calculate_geometry_array(
            Corrugate,
            (time - 0.0) / (0.1 - 0.0),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.1) && (time <= 0.23)) { // Push
        geometry_array = calculate_geometry_array(
            PushThrough,
            (time - 0.1) / (0.23 - 0.1),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.23) && (time <= 0.6)) { // Twist
        geometry_array = calculate_geometry_array(
            Twist,
            (time - 0.23) / (0.6 - 0.23),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.6) && (time <= 0.93)) { // Unpush
        geometry_array = calculate_geometry_array(
            Unpush,
            (time - 0.6) / (0.93 - 0.6),
            u_min, u_max, u_count,
            v_min, v_max, v_count,
            num_strips
        );
    }
    else if ((time > 0.93) && (time <= 1.0)) { // Uncorrugate
        geometry_array = calculate_geometry_array(
            UnCorrugate,
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

    return geometry_array;

}

export { getGeometry };