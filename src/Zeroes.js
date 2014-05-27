 
Equation.prototype.guess = function(lower, upper, respect, subintervals) {

	var wrt = respect || "x";

	var size = (upper - lower) / (subintervals || 100);

	var signChanges = [];
	var slopeChanges = [];

	var lastSign = NaN, lastSlope = NaN, currentSign = NaN, currentSlope = NaN;
	var derivative = this.differentiate(wrt);
	for (var i = lower; i <= upper; i += size) {
		currentSign = sign(this.evaluate(wrt, i));
		var currentSlope = sign(derivative.evaluate(wrt, i));


		if(currentSign === -lastSign || currentSign === 0) {
			signChanges.push({
				lower: i - size,
				upper: i,
				value: (i - size/2)
			});
		}

		if(currentSlope === -lastSlope || currentSlope === 0) {
			slopeChanges.push(i);
		}


		lastSlope = currentSlope;
		lastSign = currentSign;



	}

	slopeChanges.unshift(lower);
	slopeChanges.push(upper);




	return {
		zeroes: signChanges,
		criticals: slopeChanges
	};

};
/**
 * This applies Newton's method for finding zeroes
 *  
 * @param lower {Number} The lower bound, currently useless
 * @param upper {Number} The upper bound, currently useless
 * @param guess {Number} The guess for the zero of the function 
 * @param tolerance {Number} [epsilon] The smallest value used in seeing whether
 *  an answer is acceptable
 * @returns {Object.<Number, boolean, Number>} The zero found, whether it was 
 * found to tolerance, and the amount it differs from zero
 */

Equation.prototype.zero = function(lower, upper, guess, respect, exists, tolerance) {

	var wrt = respect || "x";

	var accuracy = tolerance || this.epsilon;
	var maxIterations = 100;
	var solution = false;
	var error = Infinity;
	if(typeof guess === "undefined") {
		guess = (lower + upper) / 2;
	} else {
		if(guess <= lower || guess >= upper) {
			throw new Error("Initial guess must be between lower and upper bounds");
		}
	}
	var x0 = guess;
	var x1 = x0;
	var deriv = this.differentiate(wrt || "x");

	for ( var i = 0; i < maxIterations; i++) {
		var y = this.evaluate(wrt, x0);
		var dy = deriv.evaluate(wrt, x0);

		x1 = x0 - y / dy;


		if (isNaN(x1)) {
			return NaN;
		}


		error = Math.abs(x0 - x1) / Math.abs(x1);

		if (error < accuracy) {

			solution = true;

			break;
		}

		x0 = x1;

	}

	if(exists && !solution) {
		var soln = this.bisection(lower, upper, wrt, tolerance);
		return {
			"solution" : soln,
			"tolerance" : true,
			"error" : this.evaluate(wrt, soln)
		};
	}	

	return {
		"solution" : x1,
		"tolerance" : solution,
		"error" : this.evaluate(wrt, x1)
	};

};

/**
 * Finds a min or max on the interval. Splits it up into n subintervals
 * checks if there is a derivative sign change on the interval, uses those as guesses
 * @param lower {Number} The lower bound of the min or max 
 * @param upper {Number} The upper bound of the min or max
 * @param subintervals {Number} The number of subintervals
 * @returns {Array} The minimums and maximums along the interval
 */
Equation.prototype.optimize = function(lower, upper, subintervals, respect) {

	var wrt = respect || "x";

	var n = subintervals || 100;

	var size = (upper - lower) / n;

	var df = this.differentiate(wrt || "x");
	var yPrime = NaN;
	var lastYPrime = NaN;
	var lastY = NaN;
	var sign = function(x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	};
	var spots = [];

	for ( var x = lower; x < upper; x += size) {
		yPrime = df.evaluate({
			"x" : x
		});
		if (sign(yPrime) == -sign(lastYPrime)) {
			spots.push(x);
		}

		y = this.evaluate(wrt, x);




		lastYPrime = yPrime;
		lastY = y;

	}

	spots = spots.map(function(x) {
		var zero = df.zero(x - size, x + size, x);

		if (zero.tolerance) {
			return zero.solution;
		} else if (x < this.epsilon || zero.solution < this.epsilon) {
			return 0;
		}
	});
	if (Math.abs(df.evaluate({
		"x" : upper
	})) < this.epsilon) {
		spots.push(upper);
	}

	if (Math.abs(df.evaluate({
		"x" : lower
	})) < this.epsilon) {
		spots.unshift(lower);
	}
	return spots.filter(function(elem, pos) {
		return spots.indexOf(elem) == pos;
	});

};

/**
 * Solves the intersection between two equations. 
 * Applies Newton's method on f(x)-g(x) = 0
 * 
 * @param curve {Equation} The second curve
 * @param lower {Number} The lower bound
 * @param upper {Number} The upper bound
 * @param guess {Number} The guess of where the intersection is 
 * @param tolerance {Number} How accurate the x value should be
 * @returns {Object.<Number, boolean, Number>} The solution
 */
Equation.prototype.solve = function(curve, lower, upper, guess, tolerance) {
	var toSolve = new Equation(new Binary("-", this.tree, curve.tree));
	return toSolve.zero(lower, upper, guess, tolerance || this.epsilon);
};

/**
 * Return the intervals of increasing and decreasing
 * 
 * @param lower The lower bound
 * @param upper The upper bound
 * @param subintervals The number of subintervals
 * @returns {Array} The intervals of increasing and decreasing
 */
Equation.prototype.criticals = function(lower, upper, respect, subintervals) {
	var wrt = respect || "x";
	var criticals = this.optimize(lower, upper, (subintervals || 100));
	var criticalIntervals = [];

	if (criticals.length === 0) {

		return [{
			"lower" : lower,
			"upper" : upper,
			"sign" : sign(this.differentiate(wrt || "x").evaluate({
				"x" : (lower + (lower + upper)/(subintervals || 100)) 
			}))
		}];
	}
	if (Math.abs(criticals[0] - lower) > this.epsilon) {
		criticals.unshift(lower);
	}

	if (Math.abs(criticals[criticals.length - 1] - upper) > this.epsilon) {
		criticals.push(upper);
	}

	var numIntervals = 0;
	for ( var i = 0; i < criticals.length - 1; i++) {
		var sgn = sign(this.differentiate(wrt || "x").evaluate({
			"x" : (criticals[i] + criticals[i + 1]) / 2
		}));
		var prevSign = null;
		if (numIntervals.length > 0) {
			prevSign = criticalIntervals[numIntervals - 1];
		}
		if (prevSign == sgn) {
			criticalIntervals[numIntervals - 1].upper = criticals[i + 1];
		} else {
			criticalIntervals.push({
				"lower" : criticals[i],
				"upper" : criticals[i + 1],
				"sign" : sgn
			});
			numIntervals++;
		}

	}

	return criticalIntervals;
};

Equation.prototype.bisection = function(x1, x2, respect, tolerance) {

	var wrt = respect || "x";
	var tolerance = tolerance || this.epsilon;



	for(var i = 0; i < 100; i++) {

		var x3 = (x1 + x2)/2;
		var fx1 = this.evaluate(wrt, x1);
		var fx2 = this.evaluate(wrt, x2);
		var fx3 = this.evaluate(wrt, x3);


		if(fx3 === 0 || (x2 - x1)/2 < tolerance) {
			return x3;
		}else {
			if(fx1 * fx3 < 0) {
				x2 = x3;
			}else {
				x1 = x3;
			}
		}
	}
};

Equation.prototype.solveZeroes = function(lower, upper, respect, subintervals, tolerance) {



	var wrt = respect || "x";
	var tolerance = tolerance || this.epsilon;
	var subintervals = subintervals || 100;

	var guesses = this.guess(lower, upper, wrt, subintervals);

	var zeroes = guesses.zeroes;
	var criticals = guesses.criticals;

	var solutions = [];

	for(var i = 0; i < zeroes.length; i++) {
		var guess = zeroes[i];
		solutions.push(this.zero(guess.lower, guess.upper, guess.value, wrt, true, tolerance));
	}

	for(var i = 0; i < criticals.length - 1; i++) {
		var current = criticals[i];
		var next = criticals[i + 1];

		solutions.push(this.zero(current, next, (current + next) / 2, wrt, false, tolerance));
	}

	var rounded = solutions.map(function(x) {

		var soln = x.solution;
		if(x.tolerance) {
			soln = Math.round(soln * 1e9) / 1e9	;
			if(soln === 0) {
				soln = 0;
			}
			return soln;

		}


	});


	return rounded.filter(function(element, position) {
		return (rounded.indexOf(element) == position && typeof element !== "undefined");
	});
}
