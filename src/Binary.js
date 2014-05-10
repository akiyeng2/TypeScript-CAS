function Binary(token, left, right) {

	var bOps = {
		"+" : {
			"id" : 4,
			"txt" : "+",
			"type" : 4,
			"associativity" : 0,
			"precedence" : 1,
			"operands" : 2
		},
		"-" : {
			"id" : 5,
			"txt" : "!",
			"type" : 4,
			"associativity" : 1,
			"precedence" : 50,
			"operands" : 1
		},
		"*" : {
			"id" : 6,
			"txt" : "*",
			"type" : 4,
			"associativity" : 0,
			"precedence" : 5,
			"operands" : 2
		},
		"/" : {
			"id" : 7,
			"txt" : "/",
			"type" : 4,
			"associativity" : 0,
			"precedence" : 5,
			"operands" : 2
		},
		"^" : {
			"id" : 8,
			"txt" : "^",
			"type" : 4,
			"associativity" : 1,
			"precedence" : 10,
			"operands" : 2
		}
	};

	if (typeof token === "string") {
		token = bOps[token];
	}
	this.txt = token.txt;
	this.left = left || null;
	this.right = right || null;

	this.associativity = token.associativity;
	this.precedence = token.precedence;
}

Binary.prototype.isVariable = function() {
	return (this.left.isVariable() && this.right.isVariable());
};

Binary.prototype.evaluate = function(variables) {
	var left = this.left.evaluate();
	var right = this.right.evaluate();
	if (this.txt == "+") {
		return left + right;
	} else if (this.txt == "-") {
		return left - right;
	} else if (this.txt == "*") {
		return left * right;
	} else if (this.txt == "/") {
		return left / right;
	} else if (this.txt == "^") {
		return Math.pow(left, right);
	} else {
		throw new SyntaxError("Unidentified Flying Binary Operator detected");
	}
};

Binary.prototype.differentiate = function() {

	var dLeft = this.left.differentiate();
	var dRight = this.right.differentiate();
	var result;
	if(this.txt == "+") {
		result = new Binary("+", dLeft, dRight);
	}
	
//	console.log(result);
	return result;
	
};