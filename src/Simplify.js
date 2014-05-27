Equation.prototype.standardize = function() {
	this.tree = this.tree.standardize();
	return this;
}

Equation.prototype.simplify = function() {

	var lastSimplification = "";


	while(this.toString() !== lastSimplification) {

		lastSimplification = this.toString();

		this.tree = this.tree.simplify();


	}


	return this;
}
