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

Binary.prototype.differentiate = function(respect) {
	var wrt = respect || "x";

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
		
		if(left.isVariable(wrt) && right.isVariable(wrt)) {
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

Binary.prototype.standardize = function(respect) {
	var wrt = respect || "x";
	// if(this.txt === "+" || this.txt == "-") {
	// 	if(!this.left.isVariable(wrt) && this.right.isVariable(wrt)) {
	// 		var temp = this.left.standardize();
	// 		this.left = this.right.standardize();
	// 		this.right = temp;
	// 	}
	// }



	if(this.txt === "*" || this.txt === "+") {



		if(this.left.isVariable(wrt) && !this.right.isVariable(wrt)) {
			var temp = this.left.standardize();
			this.left = this.right.standardize();
			this.right = temp;
		}
	}

	return this;
}
/*

tree:
		+
	   / \
	  1   +
	  	 / \
        0   x

Start at the +
	left = left.simplify()
		(1).simplify() = 1
	right = right.simplify()
		left = 0
		right = x
		return x
	1+x

*/
Binary.prototype.simplify = function(respect) {
	
	var wrt = respect || "x";


	var cur = (eqn(this).toString());
	var left = this.left.simplify();

	var right = this.right.simplify();	

	var result = this;

	result.left = left;
	result.right = right;

	if(!this.isVariable(wrt)) {

		var ans = this.evaluate();
		if(ans < 0) {

			return new Unary("-", new Operand((-ans).toString()));
		} else {
			return new Operand(ans.toString());
		}
	}

	if(this.txt === "+") {
		if(left.value === 0){
			result = right;
		} else if(right.value === 0) {
			result = left;
		}
	}

	if(this.txt === "-") {

		if(left.value === 0) {
			result = new Unary("-", right);
		} else if(right.value === 0) {
			result = left;
		}
	}


	else if(this.txt === "*") {
		if(this.left.value === 0 || this.right.value === 0) {

			result = new Operand("0");
		}

		if(left.value === 1) {

			result = right;
		} if(right.value === 1) {

			result = left;
		}

	}
	
	else if(this.txt === "/") {
		if(this.right.value === 1) {
			result = left;
		}
	}
	
	else if(this.txt === "^") {
		if(this.right.value === 1) {
			result = left;
		} else if(this.right.value === 0) {
			result = new Operand("1");
		}
		
		if(this.left.value === 1) {
			result = new Operand("1");
		}
		
		if(this.left.value === 0) {
			result = new Operand("0");
		}
	}

	return result;

};