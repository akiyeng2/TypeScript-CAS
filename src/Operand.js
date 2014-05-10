function Operand(token) {
	if (typeof token == "string") {
		token = tokenize(token)[0];
	}
	if (token.type == 0) {
		this.variable = true;
		this.value = null;
	} else if (token.type == 5) {
		this.isVariable = false;
		if (token.txt == "e") {
			this.value = Math.E;
		} else if (token.txt == "pi") {
			this.value = Math.PI;
		} else {
			this.value = parseFloat(token.txt, 10);
		}
	}
	this.txt = token.txt;

}
Operand.prototype.isVariable = function() {
	return this.variable;
};
Operand.prototype.toString = function() {
	return this.txt;
};
Operand.prototype.evaluate = function() {
	return this.value;
};
Operand.prototype.differentiate = function() {
	return (this.variable) ? new Operand("1") : new Operand("0");
};
