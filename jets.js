
// The code for generating the sphere's geometry, which was taken from evert, is rather complicated 
// (I certainly don't understand how it works !). The code makes use of things called "jets" and vectors of "jets".
// I asked the author of evert what a "jet" is. Here's his response by e-mail:


// A jet is really nothing more than the collection of all of the low-order
// derivatives of a function up to a certain point.  For instance, the
// two-jet of f(x), a function of one variable, can be represented
// by the triple (f, df/dx, d^2f/dx^2)


class TwoJet {
    constructor(d, du, dv, duv = 0) {
      this.f = d;
      this.fu = du;
      this.fv = dv;
      this.fuv = duv;
    }
  
    // derivative(index) {
    //   if (index === 0) {
    //     return new TwoJet(this.f, 0, this.fv, 0);
    //   } else if (index === 1) {
    //     return new TwoJet(this.f, this.fu, 0, 0);
    //   }
    //   return new TwoJet(this.f, this.fu, this.fv, 0);
    // }
  
    operatorPlus(other) {
      return new TwoJet(
        this.f + other.f,
        this.fu + other.fu,
        this.fv + other.fv,
        this.fuv + other.fuv
      );
    }
  
    operatorMultiply(other) {
      return new TwoJet(
        this.f * other.f,
        this.f * other.fu + this.fu * other.f,
        this.f * other.fv + this.fv * other.f,
        this.f * other.fuv + this.fu * other.fv + this.fv * other.fu + this.fuv * other.f
      );
    }
    // operatorMultiply(x) {
    //   const tempFuv = this.fuv;
    //   this.fuv = this.f * x.fuv + this.fu * x.fv + this.fv * x.fu + tempFuv * x.f;
    //   this.fu = this.f * x.fu + this.fu * x.f;
    //   this.fv = this.f * x.fv + this.fv * x.f;
    //   this.f *= x.f;
    // }
  
    operatorPlusScalar(d) {
      return new TwoJet(this.f + d, this.fu, this.fv, this.fuv);
    }
  
    operatorMultiplyScalar(d) {
      return new TwoJet(
        d * this.f,
        d * this.fu,
        d * this.fv,
        d * this.fuv
      );
    }
  
    // operatorMultiplyScalar(d) {
    //   this.f *= d;
    //   this.fu *= d;
    //   this.fv *= d;
    //   this.fuv *= d;
    // }

    operatorSin() {
      const t = this.operatorMultiplyScalar(2 * Math.PI);
      const s = Math.sin(t.f);
      const c = Math.cos(t.f);
      return new TwoJet(s, c * t.fu, c * t.fv, c * t.fuv - s * t.fu * t.fv);
    }
  
    operatorCos() {
      const t = this.operatorMultiplyScalar(2 * Math.PI);
      const s = Math.cos(t.f);
      const c = -Math.sin(t.f);
      return new TwoJet(s, c * t.fu, c * t.fv, c * t.fuv - s * t.fu * t.fv);
    }
  
    operatorPower(n) {
      const x0 = Math.pow(this.f, n);
      const x1 = this.f === 0 ? 0 : n * x0 / this.f;
      const x2 = this.f === 0 ? 0 : (n - 1) * x1 / this.f;
      return new TwoJet(
        x0,
        x1 * this.fu,
        x1 * this.fv,
        x1 * this.fuv + x2 * this.fu * this.fv
      );
    }

    // operatorPower(n) {
    //   if (this.f > 0) {
    //     const x0 = Math.pow(this.f, n);
    //     const x1 = n * x0 / this.f;
    //     const x2 = (n - 1) * x1 / this.f;
    //     this.fuv = x1 * this.fuv + x2 * this.fu * this.fv;
    //     this.fu = x1 * this.fu;
    //     this.fv = x1 * this.fv;
    //     this.f = x0;
    //   }
    // }

    operatorModulo(d) {
      const modulo_f = this.f % d;
      if (modulo_f < 0) {
        modulo_f += d;
      }
      return new TwoJet(
        modulo_f,
        this.fu,
        this.fv,
        this.fuv
      );
    }

    annihilate(index) {
      return new TwoJet(
        this.f,
        index === 1 ? this.fu : 0,
        index === 0 ? this.fv : 0,
        0
      );
    }
  
    interpolate(other, weight) {
      const negWeight = weight.operatorMultiplyScalar(-1);
      const term1 = this.operatorMultiply(negWeight.operatorPlusScalar(1));
      const term2 = other.operatorMultiply(weight);
      return term1.operatorPlus(term2);
    }

}
  



class ThreeJet {
    constructor(d, du, dv, duu=0, duv=0, dvv=0, duuv=0, duvv=0) {
        this.f = d;
        this.fu = du;
        this.fv = dv;
        this.fuu = duu;
        this.fuv = duv;
        this.fvv = dvv;
        this.fuuv = duuv;
        this.fuvv = duvv;
    }

    derivative (index) { // returns TwoJet
      if (index === 0) {
        return new TwoJet(
          this.fu,
          this.fuu,
          this.fuv,
          this.fuuv,
        );
      } else if (index === 1) {
        return new TwoJet(
          this.fv,
          this.fuv,
          this.fvv,
          this.fuvv,
        );
      } else {
        return new TwoJet(0, 0, 0, 0);
      }
    }

    annihilate (index) { // returns ThreeJet
      var result = new ThreeJet(this.f,0,0);
      if (index == 0) {
        result.fv = this.fv;
        result.fvv = this.fvv;
      } else if (index == 1) {
        result.fu = this.fu;
        result.fuu = this.fuu;
      }
      return result;
    }

    interpolate (other, weight) { // returns ThreeJet
      const negWeight = weight.operatorMultiplyScalar(-1);
      const term1 = this.operatorMultiply(negWeight.operatorPlusScalar(1));
      const term2 = other.operatorMultiply(weight);
      return term1.operatorPlus(term2);
    }

    operatorPlus (other) { // returns ThreeJet
      return new ThreeJet(
        this.f + other.f,
        this.fu + other.fu,
        this.fv + other.fv,
        this.fuu + other.fuu,
        this.fuv + other.fuv,
        this.fvv + other.fvv,
        this.fuuv + other.fuuv,
        this.fuvv + other.fuvv,
      );
    }

    operatorPlusScalar (d) { // returns ThreeJet
      return new ThreeJet(
        this.f + d,
        this.fu,
        this.fv,
        this.fuu,
        this.fuv,
        this.fvv,
        this.fuuv,
        this.fuvv,
      );
    }

    operatorMultiply(other) { // returns ThreeJet
      return new ThreeJet(
        this.f * other.f,
        this.f * other.fu + this.fu * other.f,
        this.f * other.fv + this.fv * other.f,
        this.f * other.fuu + 2*this.fu * other.fu + this.fuu * other.f,
        this.f * other.fuv + this.fu * other.fv + this.fv * other.fu + this.fuv * other.f,
        this.f * other.fvv + 2*this.fv * other.fv + this.fvv * other.f,
        this.f * other.fuuv + 2*this.fu * other.fuv + this.fv * other.fuu + 2*this.fuv * other.fu + this.fuu * other.fv + this.fuuv * other.f,
        this.f * other.fuvv + 2*this.fv * other.fuv + this.fu * other.fvv + 2*this.fuv * other.fv + this.fvv * other.fu + this.fuvv * other.f,
      );
    }

    operatorMultiplyScalar (d) { // returns ThreeJet
      return new ThreeJet(
        d * this.f,
        d * this.fu,
        d * this.fv,
        d * this.fuu,
        d * this.fuv,
        d * this.fvv,
        d * this.fuuv,
        d * this.fuvv,
      );
    }

    operatorModulo (d) { // returns ThreeJet
      const modulo_f = this.f % d;
      if (modulo_f < 0) {
        modulo_f += d;
      }
      return new ThreeJet(
        modulo_f,
        this.fu,
        this.fv,
        this.fuu,
        this.fuv,
        this.fvv,
        this.fuuv,
        this.fuvv,
      );
    }

    operatorSin () { // returns ThreeJet
      var result = new ThreeJet();
      var t = this.operatorMultiplyScalar(2 * Math.PI);

      var s = Math.sin(t.f);
      var c = Math.cos(t.f);

      result.f = s;
      result.fu = c * t.fu;
      result.fv = c * t.fv;
      result.fuu = c*t.fuu - s*t.fu*t.fu;
      result.fuv = c*t.fuv - s*t.fu*t.fv;
      result.fvv = c*t.fvv - s*t.fv*t.fv;
      result.fuuv = c*t.fuuv - s*(2*t.fu*t.fuv + t.fv*t.fuu) - c*t.fu*t.fu*t.fv;
      result.fuvv = c*t.fuvv - s*(2*t.fv*t.fuv + t.fu*t.fvv) - c*t.fu*t.fv*t.fv;

      return result;
    }

    operatorCos () { // returns ThreeJet
      var result = new ThreeJet();
      var t = this.operatorMultiplyScalar(2 * Math.PI);

      var s = Math.cos(t.f);
      var c = -Math.sin(t.f);

      result.f = s;
      result.fu = c * t.fu;
      result.fv = c * t.fv;
      result.fuu = c*t.fuu - s*t.fu*t.fu;
      result.fuv = c*t.fuv - s*t.fu*t.fv;
      result.fvv = c*t.fvv - s*t.fv*t.fv;
      result.fuuv = c*t.fuuv - s*(2*t.fu*t.fuv + t.fv*t.fuu) - c*t.fu*t.fu*t.fv;
      result.fuvv = c*t.fuvv - s*(2*t.fv*t.fuv + t.fu*t.fvv) - c*t.fu*t.fv*t.fv;
      
      return result;
    }

    operatorPower (n) { // returns ThreeJet
      var x0 = Math.pow(this.f, n);
      var x1 = this.f === 0 ? 0 : (n * x0) / this.f;
      var x2 = this.f === 0 ? 0 : ((n - 1) * x1) / this.f;
      var x3 = this.f === 0 ? 0 : ((n - 2) * x2) / this.f;
      return new ThreeJet(
        x0,
        x1 * this.fu,
        x1 * this.fv,
        x1 * this.fuu + x2 * this.fu * this.fu,
        x1 * this.fuv + x2 * this.fu * this.fv,
        x1 * this.fvv + x2 * this.fv * this.fv,
        x1 * this.fuuv + x2 * (2 * this.fu * this.fuv +   this.fv * this.fuu) + x3 * this.fu * this.fu * this.fv,
        x1 * this.fuvv + x2 * (2 * this.fv * this.fuv +   this.fu * this.fvv) + x3 * this.fu * this.fv * this.fv,
      );
    }

    get_two_jet () { // returns TwoJet
      return new TwoJet(this.f, this.fu, this.fv, this.fuv);
    }
}

class TwoJetVec {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  operatorPlus(other) {
    return new TwoJetVec(
      this.x.operatorPlus(other.x),
      this.y.operatorPlus(other.y),
      this.z.operatorPlus(other.z)
    );
  }
  
  operatorMultiply(other) { // other is TwoJet
    // there is no function for multiplying a TwoJetVec by a TwoJetVec
    return new TwoJetVec(
      this.x.operatorMultiply(other),
      this.y.operatorMultiply(other),
      this.z.operatorMultiply(other)
    );
  }

  operatorMultiplyScalar(d) {
    return new TwoJetVec(
      this.x.operatorMultiplyScalar(d),
      this.y.operatorMultiplyScalar(d),
      this.z.operatorMultiplyScalar(d)
    );
  }

  annihilate_vec(index) {
    return new TwoJetVec(
      this.x.annihilate(index),
      this.y.annihilate(index),
      this.z.annihilate(index)
    );
  }

  // derivative_vec(index) {
  //   return new TwoJetVec(
  //     this.x.derivative(index),
  //     this.y.derivative(index),
  //     this.z.derivative(index)
  //   );
  // }
  

  cross(other) {
    return new TwoJetVec(
      this.y.operatorMultiply(other.z).operatorPlus(this.z.operatorMultiply(other.y)),
      this.z.operatorMultiply(other.x).operatorPlus(this.x.operatorMultiply(other.z)),
      this.x.operatorMultiply(other.y).operatorPlus(this.y.operatorMultiply(other.x))
    );
  }

  dot(other) { // returns TwoJet
    const x_temp = this.x.operatorMultiply(other.x);
    const y_temp = this.y.operatorMultiply(other.y);
    const z_temp = this.z.operatorMultiply(other.z);
    return x_temp.operatorPlus(y_temp).operatorPlus(z_temp);
  }

  normalize() { // returns TwoJetVec
    var a = this.dot(this);
    if (a.f > 0) {
      a = a.operatorPower(-0.5);
    } else {
      a = new TwoJet(0,0,0);
    }

    return this.operatorMultiply(a);
  }

  rotate_z (angle) { // returns TwoJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new TwoJetVec(
      this.x.operatorMultiply(c).operatorPlus(this.y.operatorMultiply(s)),
      this.y.operatorMultiply(c).operatorPlus(this.x.operatorMultiply(s)),
      this.z
    );
  }

  rotate_y (angle) { // returns TwoJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new TwoJetVec(
      this.x.operatorMultiply(c).operatorPlus(this.z.operatorMultiply(s).operatorMultiplyScalar(-1)),
      this.y,
      this.z.operatorMultiply(c).operatorPlus(this.x.operatorMultiply(s))
    );
  }

  rotate_x (angle) { // returns TwoJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new TwoJetVec(
      this.x,
      this.y.operatorMultiply(c).operatorPlus(this.z.operatorMultiply(s)),
      this.z.operatorMultiply(c).operatorPlus(this.y.operatorMultiply(s).operatorMultiplyScalar(-1))
    );
  }

  interpolate_vec (other, weight) { // returns TwoJetVec
    const negWeight = weight.operatorMultiplyScalar(-1);
    const term1 = this.operatorMultiply(negWeight.operatorPlusScalar(1));
    const term2 = other.operatorMultiply(weight);
    return term1.operatorPlus(term2);
  }

  length() { // returns TwoJet
    // for some reason this function does not take z into account
    const x_squared = this.x.operatorMultiply(this.x);
    const y_squared = this.y.operatorMultiply(this.y);
    const sum = x_squared.operatorPlus(y_squared);
    return sum.operatorPower(0.5);
  }
}


class ThreeJetVec {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  operatorPlus(other) { // returns ThreeJetVec
    return new ThreeJetVec(
      this.x.operatorPlus(other.x),
      this.y.operatorPlus(other.y),
      this.z.operatorPlus(other.z)
    );
  }

  operatorMultiply(other) { // returns ThreeJetVec, other is ThreeJet
    // there is no function for multiplying a ThreeJetVec by a ThreeJetVec
    return new ThreeJetVec(
      this.x.operatorMultiply(other),
      this.y.operatorMultiply(other),
      this.z.operatorMultiply(other)
    );
  }

  operatorMultiplyScalar(d) { // returns ThreeJetVec
    return new ThreeJetVec(
      this.x.operatorMultiplyScalar(d),
      this.y.operatorMultiplyScalar(d),
      this.z.operatorMultiplyScalar(d)
    );
  }

  annihilate_vec(index) { // returns ThreeJetVec
    return new ThreeJetVec(
      this.x.annihilate(index),
      this.y.annihilate(index),
      this.z.annihilate(index)
    );
  }

  derivative_vec(index) { // returns TwoJetVec
    return new TwoJetVec(
      this.x.derivative(index),
      this.y.derivative(index),
      this.z.derivative(index)
    );
  }

  cross(other) { // returns ThreeJetVec
    return new ThreeJetVec(
      this.y.operatorMultiply(other.z).operatorPlus(this.z.operatorMultiply(other.y).operatorMultiplyScalar(-1)),
      this.z.operatorMultiply(other.x).operatorPlus(this.x.operatorMultiply(other.z).operatorMultiplyScalar(-1)),
      this.x.operatorMultiply(other.y).operatorPlus(this.y.operatorMultiply(other.x).operatorMultiplyScalar(-1))
    );
  }

  dot(other) { // returns ThreeJet
    const x_temp = this.x.operatorMultiply(other.x);
    const y_temp = this.y.operatorMultiply(other.y);
    const z_temp = this.z.operatorMultiply(other.z);
    return x_temp.operatorPlus(y_temp).operatorPlus(z_temp);
  }

  normalize() { // returns ThreeJetVec
    var a = this.dot(this);

    if (a.f > 0) {
      a = a.operatorPower(-0.5);
    } else {
      a = new ThreeJet(0,0,0);
    }

    return this.operatorMultiply(a);
  }

  rotate_z (angle) { // returns ThreeJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new ThreeJetVec(
      this.x.operatorMultiply(c).operatorPlus(this.y.operatorMultiply(s)),
      this.x.operatorMultiply(s).operatorMultiplyScalar(-1).operatorPlus(this.y.operatorMultiply(c)),
      this.z
    );
  }

  rotate_y (angle) { // returns ThreeJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new ThreeJetVec(
      this.x.operatorMultiply(c).operatorPlus(this.z.operatorMultiply(s).operatorMultiplyScalar(-1)),
      this.y,
      this.x.operatorMultiply(s).operatorPlus(this.z.operatorMultiply(c))
    );
  }

  rotate_x (angle) { // returns ThreeJetVec
    var s = angle.operatorSin();
    var c = angle.operatorCos();

    return new ThreeJetVec(
      this.x,
      this.y.operatorMultiply(c).operatorPlus(this.z.operatorMultiply(s)),
      this.y.operatorMultiply(s).operatorMultiplyScalar(-1).operatorPlus(this.z.operatorMultiply(c))
    );
  }

  interpolate_vec (other, weight) { // returns ThreeJetVec
    const negWeight = weight.operatorMultiplyScalar(-1);
    const term1 = this.operatorMultiply(negWeight.operatorPlusScalar(1));
    const term2 = other.operatorMultiply(weight);
    return term1.operatorPlus(term2);
  }

  length() { // returns ThreeJet
    // for some reason this function does not take z into account
    const x_squared = this.x.operatorMultiply(this.x);
    const y_squared = this.y.operatorMultiply(this.y);
    const sum = x_squared.operatorPlus(y_squared);
    return sum.operatorPower(0.5);
  }
}


export { TwoJet, ThreeJet, TwoJetVec, ThreeJetVec };