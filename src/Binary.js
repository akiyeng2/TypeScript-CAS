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
			"txt" : "-",
			"type" : 4,
			"associativity" : 1,
			"precedence" : 1,
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

Binary.prototype.isVariable = function(wrt) {
	return (this.left.isVariable(wrt) || this.right.isVariable(wrt));
};

Binary.prototype.evaluate = function(variables) {
	var left = this.left.evaluate(variables);
	var right = this.right.evaluate(variables);
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

Binary.prototype.differentiate = function(wrt) {
	var left = this.left;
	var right = this.right;
	
	var dLeft = this.left.differentiate(wrt);
	var dRight = this.right.differentiate(wrt);
	var result = null;
	if(this.txt == "+") {
		result = new Binary("+", dLeft, dRight);
	}else if(this.txt == "-") {
		result = new Binary("-", dLeft, dRight);
	}else if(this.txt == "*") {
		result = new Binary("+", 
				new Binary("*", left, dRight), 
				new Binary("*", right, dLeft)
		);
	}else if(this.txt == "/") {
		result = new Binary("/", 
					new Binary("-", 
							new Binary("*", right, dLeft), 
							new Binary("*", left, dRight)
					),
					new Binary("^", right, new Operand("2"))
		);
	}else if(this.txt == "^") {
		var powerRule = new Binary("*", 
				new Binary("*", right, 
						new Binary("^", left, 
								new Binary("-", right, new Operand("1")
								)
						)
				), 
				dLeft);

		
		var exponentRule = new Binary("*", 
				new Binary("*", 
						new Binary("^", left, right),
						dRight
				), new Unary("ln", left)
		);
		
		if(left.isVariable() && right.isVariable()) {
			result = new Binary("+", powerRule, exponentRule);
		}else if(left.isVariable(wrt) && !right.isVariable(wrt)) {
			result = powerRule;
		}else if(!left.isVariable(wrt) && right.isVariable(wrt)) {
			result = exponentRule;
		}else{
			result = new Operand("0");
		}
	}

	
	return result;
	
};