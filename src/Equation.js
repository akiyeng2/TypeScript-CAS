function Equation(expression) {
	this.tree = null;
	if(typeof expression == "string") {
		this.tree = toTree(shunt(expression));
	}else if(expression instanceof Binary || expression instanceof Unary || expression instanceof Operand) {
		this.tree = expression;
	}
}

Equation.prototype.differentiate = function() {
	return new Equation(this.tree.differentiate());
};

