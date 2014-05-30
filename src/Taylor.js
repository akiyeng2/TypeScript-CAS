Equation.prototype.Taylor = function(order, centerTxt, respect) {
	
	var factorials = [
			1,
			1,
			2,
			6,
			24,
			120,
			720,
			5040,
			40320,
			362880,
			3628800,
			39916800,
			479001600,
			6227020800,
			87178291200,
			1307674368000,
			20922789888000,
			355687428096000,
			6402373705728000,
			121645100408832000,
			2432902008176640000,
			51090942171709440000];

	
	
	var wrt = respect || "x";
	var center = new Equation(centerTxt).evaluate() || 0;
	
	if(order > 21) {
		throw new Error("Order must be less than 22")
	}
	var lastDerivative = this;
	var coefficients = [];
	
	
	for(var i = 0; i <= order; i++) {
		var slope = lastDerivative.evaluate(wrt, center);
		if(isNaN(slope) || !isFinite(slope)) {
			throw new Error("Derivative does not exist");
		}
		coefficients.push(Math.round(slope * 1e9) / 1e9);
		lastDerivative = simplify(lastDerivative.differentiate(wrt));
	}

	
	if(center === 0) {
		var x = "x";
	} else if(center < 0) {
		var x = "(x+(" + centerTxt + "))";
	} else {
		var x= "(x - (" + centerTxt + "))";
	}

	var series = new Operand(coefficients[0]);



	for(var i = 1; i < coefficients.length; i++) {
		var frac = new Fraction(coefficients[i], factorials[i]);
		var str = Math.abs(frac.numerator) + x + "^" + i + "/" + frac.denominator;
		
		if(frac.numerator > 0) {
			series = new Binary("+", series, tree(str));
		} else if(frac.numerator < 0){
			series = new Binary("-", series, tree(str));
		}
		
	}
	
	return simplify(new Equation(series));
	
	
		
		

}

Equation.prototype.integrate = function(lower, upper, respect, subintervals) {
	
	var subintervals = subintervals || 100000;
	var size = (upper - lower) / subintervals;
	var wrt = respect || "x";

	var sum = 0;

	for(var i = lower; i < upper; i += size) {
		var left = this.evaluate(wrt, i);
		var right = this.evaluate(wrt, i + size);

		sum += ((left + right) / 2) * size;
	}

	return sum;
}