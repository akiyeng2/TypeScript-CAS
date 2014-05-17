function Equation(expression) {
	this.tree = null;
	if (typeof expression == "string") {
		this.tree = toTree(shunt(expression));
	} else if (expression instanceof Binary || expression instanceof Unary
			|| expression instanceof Operand) {
		this.tree = expression;
	}
}

Equation.prototype.toString = function() {
	return toInfix(this.tree);
};

Equation.prototype.display = function() {
	document.body.innerHTML = "";

	document.body.innerHTML += ("$$" + toTex(this.tree) + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);
};

Equation.prototype.differentiate = function() {
	return new Equation(this.tree.differentiate());
};

Equation.prototype.evaluate = function(variables) {
	return this.tree.evaluate(variables);
};

Equation.prototype.zero = function(lower, upper, guess, tolerance) {
	var accuracy = tolerance || 1e-14;
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
		} else if (x < 1e-10 || zero.solution < 1e-14) {
			return 0;
		}
	});
	if (Math.abs(df.evaluate({
		"x" : upper
	})) < 1e-14) {
		spots.push(upper);
	}

	if (Math.abs(df.evaluate({
		"x" : lower
	})) < 1e-14) {
		spots.unshift(lower);
	}
	return spots.filter(function(elem, pos) {
		return spots.indexOf(elem) == pos;
	});

};

Equation.prototype.solve = function(curve, lower, upper, guess, tolerance) {
	var toSolve = new Equation(new Binary("-", this.tree, curve.tree));
	return toSolve.zero(lower, upper, guess, tolerance || 1e-14);
};

Equation.prototype.criticals = function(lower, upper, subintervals) {
	var criticals = this.optimize(lower, upper, (subintervals || 100));
	var criticalIntervals = [];
	var sign = function(x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN
				: NaN;
	};

	if (criticals.length == 0) {

		return [{
			"lower" : lower,
			"upper" : upper,
			"sign" : sign(this.differentiate().evaluate({
				"x" : (lower + (lower + upper)/(subintervals || 100)) 
			}))
		}];
	}
	if (Math.abs(criticals[0] - lower) > 1e-10) {
		criticals.unshift(lower);
	}

	if (Math.abs(criticals[criticals.length - 1] - upper) > 1e-10) {
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
