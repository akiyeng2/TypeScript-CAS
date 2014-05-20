/**
 * @constructor
 * 
 * @param {String|Tree} expression The equation in string form or tree form
 */
function Equation(expression) {
	this.tree = null;
	if (typeof expression == "string") {
		this.tree = toTree(shunt(expression));
	} else if (expression instanceof Binary || expression instanceof Unary || expression instanceof Operand) {
		this.tree = expression;
	}
}

/**
 * This is the smallest value that things should be
 */
Equation.prototype.epsilon = 1e-14;

/**
 * Converts the tree into infix notation
 * 
 * @returns {String} The infix string, sans unnecessary parens
 */
Equation.prototype.toString = function() {
	return toInfix(this.tree);
};

/**
 * Displays an equation on the screen
 * 
 */
Equation.prototype.display = function() {
	document.body.innerHTML = "";

	document.body.innerHTML += ("$$" + toTex(this.tree) + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);
};

/**
 * Differentiates the tree
 * 
 * @returns {Equation} The differentiated equation
 */
Equation.prototype.differentiate = function() {
	return new Equation(this.tree.differentiate());
};

/**
 * Evaluates a tree
 * 
 * @param variables The variables in object form, like {"x": xValue}
 * @returns {Number} The evaluated tree
 */
Equation.prototype.evaluate = function(variables) {
	return this.tree.evaluate(variables);
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
Equation.prototype.zero = function(lower, upper, guess, tolerance) {
	var accuracy = tolerance || this.epsilon;
	var maxIterations = 100;
	var solution = false;
	var error = Infinity;

	var x0 = guess;
	var x1 = guess;
	var deriv = this.differentiate();

	for ( var i = 0; i < maxIterations; i++) {
		var y = this.evaluate({
			"x" : x0
		});
		var dy = deriv.evaluate({
			"x" : x0
		});

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

	return {
		"solution" : x1,
		"tolerance" : solution,
		"error" : this.evaluate({
			"x" : x1
		})
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
Equation.prototype.optimize = function(lower, upper, subintervals) {
	var n = subintervals || 100;

	var size = (upper - lower) / n;

	var df = this.differentiate();
	var yPrime = NaN;
	var lastYPrime = NaN;
	var sign = function(x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN
				: NaN;
	};
	var spots = [];

	for ( var x = lower; x < upper; x += size) {
		yPrime = df.evaluate({
			"x" : x
		});
		if (sign(yPrime) == -1 * sign(lastYPrime)) {
			spots.push(x);
		}

		lastYPrime = yPrime;

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
Equation.prototype.criticals = function(lower, upper, subintervals) {
	var criticals = this.optimize(lower, upper, (subintervals || 100));
	var criticalIntervals = [];
	var sign = function(x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN
				: NaN;
	};

	if (criticals.length === 0) {

		return [{
			"lower" : lower,
			"upper" : upper,
			"sign" : sign(this.differentiate().evaluate({
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
		var sgn = sign(this.differentiate().evaluate({
			"x" : (criticals[i] + criticals[i + 1]) / 2
		}));
		var prevSign = 0;
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

pi = Math.PI;