var resultsDiv = document.getElementById("results");
function tex(str) {
	return toTex(simplify(eqn(str)).tree);
};

function texTree(tree) {
	return tex(displayTree(tree));
}

function texEqn(eqn) {
	return toTex(eqn.tree);
}
function stringifyPostfix(expression) {
	var str = "";
	var a = shunt(expression);
	for (var i = 0; i < a.length; i++) {
		str += a[i].txt + " ";
	}
	return str;
}
function stringy(arr) {
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		str += arr[i].txt + " ";
	}
	return str;
}
function evaluateFunction(expression, variables) {
	return Math.round(tree(expression).evaluate(variables) * 1e10) / 1e10;
}
function differentiateFunction(expression, wrt, show) {

	var show = show || false;
	resultsDiv.innerHTML = "";

	var result = toTex(simplify(new Equation(expression).differentiate(wrt, show)).tree);

	resultsDiv.innerHTML += ("$$\\frac{d}{dx}\\left(" + toTex(tree(expression))
			+ "\\right)=" + result + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}
function differentiateFunctionNoSimplify(expression, wrt, show) {

	var show = show || false;

	var result = toTex(toTree(shunt(expression)).differentiate(wrt, show));
	resultsDiv.innerHTML = "";
	resultsDiv.innerHTML += ("$$\\frac{d}{dx}\\left(" + toTex(tree(expression))
			+ "\\right)=" + result + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);
}
function simplifyExpression(expression) {
	return simplify(toTree(shunt(expression)));
}
function tree(expression) {
	return toTree(shunt(expression));
}
function displayTree(tree) {
	return new Equation(tree).toString();
}

function evaluateTree(tree, variables) {

	if (tree instanceof Operand) {
		return tree.value;
	}
	if (tree.leftOperand !== undefined) {
		return tree.evaluate();

	} else {

		return tree.evaluate();
	}
}

function unitTest() {
	var expression = new Expression("1/2");

	console.log(displayTree(expression.tree.makeCommutative()));
}
function solve(first, second, guess) {
	return new Equation(first).solve(new Equation(second), -10, 10, guess);
}

function sign(x) {
	return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function eqn(str) {
	return new Equation(str);
}

Math.pow_ = Math.pow;

// redefine the method
Math.pow = function(_base, _exponent) {
	if (_base < 0) {
		if (Math.abs(_exponent) < 1) {
			// we're calculating nth root of _base, where n === 1/_exponent
			if (1 / _exponent % 2 === 0) {
				// nth root of a negative number is imaginary when n is even, we
				// could return
				// a string like "123i" but this would completely mess up
				// further computation
				return NaN;
			}
			// nth root of a negative number when n is odd
			return -Math.pow_(Math.abs(_base), _exponent);
		}
	} /* else if _base >=0 */
	// run the original method, nothing will go wrong
	return Math.pow_(_base, _exponent);
};

// Thanks to @o.v. for providing this code at
// http://stackoverflow.com/a/12813002/2027567

function integrate(expression, lower, upper, wrt) {
	resultsDiv.innerHTML = "$$\\int_"
			+ lower
			+ "^"
			+ upper
			+ "\\left("
			+ tex(expression)
			+ "\\right)"
			+ "dx"
			+ "="
			+ Math
					.round(eqn(expression)
							.integrate(lower, upper, (wrt || "x")) * 1e5) / 1e5
			+ "$$" + "<br>";

	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}
function taylor(expression, order, center, respect) {

	var gcd = function(a, b) {
		if (!b) {
			return a;
		}

		return gcd(b, a % b);
	};

	
	var texString = "$$"

	var wrt = respect || "x";
	var coefficients = eqn(expression).Taylor(order, center, wrt);

	for (var i = 0; i < coefficients.length; i++) {
		var coefficient = Math.round(coefficients[i] * 1e7) / 1e7;
		var denominator = factorials[i];
		if (center == 0) {
			x = "x";
		} else if (center > 0) {
			x = "(x-" + center + ")";
		} else {
			x = "(x+" + -center + ")";
		}

		if (coefficient % 1 === 0) {
			var g = gcd(coefficient, denominator);

			coefficient /= Math.abs(g);
			denominator /= Math.abs(g);

			if (coefficient !== 0) {
				if (Math.abs(coefficient) === 1) {
					if (coefficient > 0) {
						texString += "+"
								+ ((tex(x + "^" + i + "/" + denominator)));
					} else {
						texString += "-"
								+ ((tex(x + "^" + i + "/" + denominator)));

					}
				} else {
					if (coefficient > 0) {
						texString += "+"
								+ ((tex(coefficient + x + "^" + i + "/"
										+ denominator)));
					} else {
						texString += "-"
								+ ((tex(-coefficient + x + "^" + i + "/"
										+ denominator)));

					}
				}
			}
		} else {

			if (new Fraction(coefficient, denominator).denominator > 1e5) {
				if (coefficient > 0) {
					texString += "+"
							+ ((tex(coefficient + x + "^" + i + "/"
									+ denominator)));

				} else {
					texString += "-"
							+ ((tex(-coefficient + x + "^" + i + "/"
									+ denominator)));

				}
			} else {
				var fraction = new Fraction(coefficient, denominator);
				coefficient = fraction.numerator;
				denominator = fraction.denominator;
				if (coefficient > 0) {
					texString += "+"
							+ ((tex(coefficient + x + "^" + i + "/"
									+ denominator)));

				} else {
					texString += "-"
							+ ((tex(-coefficient + x + "^" + i + "/"
									+ denominator)));

				}
			}

		}
	}

	texString = texString.substring(3);
	texString = "$$" + texString;
	texString += "$$";

	resultsDiv.innerHTML = texString;
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}

function getInfo(expression, lower, upper, respect, subintervals, tolerance) {

	var subintervals = subintervals || 100;
	var wrt = respect || "x";
	var tolerance = tolerance || Equation.prototype.epsilon;

	lower = new Equation(lower).evaluate();
	upper = new Equation(upper).evaluate();

	var fn = new Equation(expression);

	var zeroes = new Equation(expression).solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML = "";
	resultsDiv.innerHTML += "<div style = 'font-size: 150%'>$y=" + texEqn(fn)
			+ "$</div><br><br>";

	zeroes = zeroes.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	zeroes = zeroes.filter(function(element, position) {
		return zeroes.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Zeroes: } $</div><br>"
	for (var i = 0; i < zeroes.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + zeroes[i] + "$<br>"
	}

	var firstDerivative = simplify(fn.differentiate(wrt));

	var criticals = firstDerivative.solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML += "<br><br><div style = 'font-size: 150%'>$\\frac{dy}{dx} = "
			+ texEqn(firstDerivative) + "$</div><br><br>";

	criticals = criticals.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	criticals = criticals.filter(function(element, position) {
		return criticals.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Critical Points: } $</div><br>"
	for (var i = 0; i < criticals.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + criticals[i] + "$<br>"
	}

	criticals.unshift(Math.round(lower * 1e5) / 1e5);
	criticals.push(Math.round(upper * 1e5) / 1e5);

	criticals = criticals.filter(function(element, position) {
		return criticals.indexOf(element) === position;
	});

	var criticalIntervals = [];

	var numIntervals = 0;

	for (var i = 0; i < criticals.length - 1; i++) {

		var sgn = sign(firstDerivative.evaluate(wrt,
				(criticals[i] + criticals[i + 1]) / 2));

		var prevSign = null;
		if (numIntervals > 0) {

			prevSign = criticalIntervals[numIntervals - 1].sign;
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

	var mins = [];
	var maxes = [];

	for (var i = 0; i < criticalIntervals.length; i++) {

		if (i === 0) {
			if (criticalIntervals[0].sign === -1) {
				maxes.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"

				});

				mins.push({
					"x" : criticalIntervals[i].lower,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].lower) * 1e5) / 1e5,
					"type" : "local"
				});

			} else {
				mins.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});

				maxes.push({
					"x" : criticalIntervals[i].lower,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].lower) * 1e5) / 1e5,
					"type" : "local"
				});
			}
		} else {
			if (criticalIntervals[i].sign === 1) {

				mins.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});
			} else {
				maxes.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});
			}
		}
	}

	var temp = maxes;
	maxes = mins;
	mins = temp;
	var globalMin = Infinity;

	for (var i = 0; i < mins.length; i++) {
		if (mins[i].y < globalMin) {
			globalMin = mins[i].y;
		}
	}

	for (var i = 0; i < mins.length; i++) {
		if (mins[i].y === globalMin) {
			mins[i].type = "global";
		}
	}

	var globalMax = -Infinity;
	var globalMaxNums = [];
	for (var i = 0; i < maxes.length; i++) {
		if (maxes[i].y >= globalMax) {
			globalMax = maxes[i].y;

		}
	}

	for (var i = 0; i < maxes.length; i++) {
		if (maxes[i].y === globalMax) {
			maxes[i].type = "global";
		}
	}

	resultsDiv.innerHTML += "<br>"
	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text{Minima: }$</div><br>";
	for (var i = 0; i < mins.length; i++) {

		resultsDiv.innerHTML += "$\\text{"
				+ ((mins[i].type === "local") ? "Local" : "Global")
				+ " minimum at } (" + mins[i].x + "," + mins[i].y + ")$<br>";
	}

	resultsDiv.innerHTML += "<br>"
	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text{Maxima: }$</div><br>";

	for (var i = 0; i < maxes.length; i++) {

		resultsDiv.innerHTML += "$\\text{"
				+ ((maxes[i].type === "local") ? "Local" : "Global")
				+ " maximum at } (" + maxes[i].x + "," + maxes[i].y + ")$<br>";
	}

	var decIntervals = [];
	var incIntervals = [];

	resultsDiv.innerHTML += "<br><div style = 'font-size: 125%'>$\\text{Intervals of increasing and decreasing: }$</div><br>";

	var incString = "$\\text{Increasing: }$ $\\nobreakspace";
	var decString = "$\\text{Decreasing: }$ $\\nobreakspace";
	var incStringAdd = "";
	var decStringAdd = "";
	for (var i = 0; i < criticalIntervals.length; i++) {
		if (criticalIntervals[i].sign === -1) {
			decStringAdd += "(" + criticalIntervals[i].lower + ","
					+ criticalIntervals[i].upper + ")\\cup";
		} else {
			incStringAdd += "(" + criticalIntervals[i].lower + ","
					+ criticalIntervals[i].upper + ")\\cup";
		}

	}

	resultsDiv.innerHTML += incString + incStringAdd.slice(0, -4) + "$<br>";

	resultsDiv.innerHTML += decString + decStringAdd.slice(0, -4) + "$<br>";

	var secondDerivative = simplify(firstDerivative.differentiate(wrt));

	var inflections = secondDerivative.solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML += "<br><br><div style = 'font-size: 150%'>$\\frac{d^2y}{dx^2} = "
			+ texEqn(secondDerivative) + "$</div><br><br>";

	inflections = inflections.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	inflections = inflections.filter(function(element, position) {
		return inflections.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Points of Inflection: } $</div><br>"
	for (var i = 0; i < inflections.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + inflections[i] + "$<br>"
	}
	resultsDiv.innerHTML += "<br>";

	inflections.unshift(Math.round(lower * 1e5) / 1e5);
	inflections.push(Math.round(upper * 1e5) / 1e5);

	inflections = inflections.filter(function(element, position) {
		return inflections.indexOf(element) === position;
	});

	var inflectionIntervals = [];

	var numIntervals = 0;

	for (var i = 0; i < inflections.length - 1; i++) {

		var sgn = sign(secondDerivative.evaluate(wrt,
				(inflections[i] + inflections[i + 1]) / 2));

		var prevSign = null;
		if (numIntervals > 0) {

			prevSign = inflectionIntervals[numIntervals - 1].sign;
		}

		if (prevSign == sgn) {
			inflectionIntervals[numIntervals - 1].upper = inflections[i + 1];
		} else {
			inflectionIntervals.push({
				"lower" : inflections[i],
				"upper" : inflections[i + 1],
				"sign" : sgn
			});

			numIntervals++;

		}

	}

	var ccupString = "$\\text{Concave Up: }    ";
	var ccdownString = "$\\text{Concave Down: }    "

	for (var i = 0; i < inflectionIntervals.length; i++) {

		if (inflectionIntervals[i].sign === -1) {
			ccdownString += "(" + inflectionIntervals[i].lower + ","
					+ inflectionIntervals[i].upper + ")\\cup";
		} else {
			ccupString += "(" + inflectionIntervals[i].lower + ","
					+ inflectionIntervals[i].upper + ")\\cup";
		}

	}

	resultsDiv.innerHTML += ccupString.slice(0, -4) + "$<br>";
	resultsDiv.innerHTML += ccdownString.slice(0, -4) + "$";

	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}

function simplify(exp) {
	var last = "";
	var current = exp;

	while (current.toString() !== last) {
		last = current.toString();

		current.tree = (current.tree.simplify());

	}

	return current;
}
