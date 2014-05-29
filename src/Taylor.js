Equation.prototype.Taylor = function(order, center, respect) {
	var wrt = respect || "x";
	var center = center || 0;
	var lastDerivative = this;
	var coefficients = [];
	for(var i = 0; i <= order; i++) {
		var slope = lastDerivative.evaluate(wrt, center);
		if(isNaN(slope) || !isFinite(slope)) {
			throw new Error("Derivative does not exist");
		}
		coefficients.push(slope);
		lastDerivative = simplify(lastDerivative.differentiate(wrt));
	}

	return coefficients;
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