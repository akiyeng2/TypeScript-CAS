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
Equation.prototype.epsilon = 1e-10;

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
Equation.prototype.differentiate = function(wrt, show) {
	
	var show = show || false;

	return new Equation(this.tree.differentiate(wrt, show));
};

/**
 * Evaluates a tree
 * 
 * @param variables The variables in object form, like {"x": xValue}
 * @returns {Number} The evaluated tree
 */
Equation.prototype.evaluate = function() {
	var vars = Array.prototype.slice.call(arguments);

	var variables = {};

	if(vars.length % 2 !== 0) {
		throw new Error("Mismatched variables and values");
	} else {
		for(var i = 0; i < vars.length; i += 2) {
			if(typeof vars[i] !== "string") {
				throw new Error("Variable name must be string");
			} else {
				variables[vars[i]] = (typeof vars[i + 1] === "string") ? new Equation(vars[i + 1]).evaluate() : vars[i + 1];
			}
		}
	}

	return this.tree.evaluate(variables);
};

Equation.prototype.equals = function(second) {
	return this.toString() == second.toString();
}



pi = Math.PI;
