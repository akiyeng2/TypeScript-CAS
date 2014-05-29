Equation.prototype.standardize = function() {
	this.tree = this.tree.standardize();
	return this;
}

Equation.prototype.simplify = function() {

	this.tree = this.tree.simplify();
	
	
}

