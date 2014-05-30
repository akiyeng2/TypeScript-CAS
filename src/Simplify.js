Equation.prototype.standardize = function() {
	this.tree = this.tree.standardize();
	return this;
}

Equation.prototype.simplify = function() {g
	this.tree = this.tree.simplify();	
}

