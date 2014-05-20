function Operand(token) {
	if (typeof token == "string") {
		token = tokenize(token)[0];
	}
	if (token.type == 0) {
		this.variable = true;
		this.value = null;
	} else if (token.type == 5) {
		this.variable = false;
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
Operand.prototype.isVariable = function(wrt) {
	return (this.variable && this.txt == wrt);
};
Operand.prototype.toString = function() {
	return this.txt;
};
Operand.prototype.evaluate = function(variables) {
	if(this.variable) {
		var value = variables[this.txt];
		if(typeof value == "number") {
			return value;
		}else{
			return tree(value).evaluate(variables);
		}
	}
	return this.value;
};
Operand.prototype.differentiate = function(wrt) {
	if(this.variable && this.txt == wrt) {
		return new Operand("1");
	} else {
		return new Operand("0");
	}
};
