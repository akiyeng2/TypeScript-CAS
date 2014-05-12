function Unary(token, operand) {
	var uOps = {
		"-" : {
			"id" : 5,
			"txt" : "-",
			"type" : 4,
			"associativity" : 1,
			"precedence" : 50,
			"operands" : 1
		},
		"sin" : {
			"id" : 1,
			"txt" : "sin",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"cos" : {
			"id" : 1,
			"txt" : "cos",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"tan" : {
			"id" : 1,
			"txt" : "tan",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"csc" : {
			"id" : 1,
			"txt" : "csc",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"sec" : {
			"id" : 1,
			"txt" : "sec",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"cot" : {
			"id" : 1,
			"txt" : "cot",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},

		"arcsin" : {
			"id" : 1,
			"txt" : "arcsin",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"arccos" : {
			"id" : 1,
			"txt" : "arccos",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"arctan" : {
			"id" : 1,
			"txt" : "arctan",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"arccsc" : {
			"id" : 1,
			"txt" : "arccsc",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"arcsec" : {
			"id" : 1,
			"txt" : "arcsec",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"arccot" : {
			"id" : 1,
			"txt" : "arccot",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},

		"log" : {
			"id" : 1,
			"txt" : "log",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"ln" : {
			"id" : 1,
			"txt" : "ln",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"sqrt" : {
			"id" : 1,
			"txt" : "sqrt",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"abs" : {
			"id" : 1,
			"txt" : "abs",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		},
		"log" : {
			"id" : 1,
			"txt" : "log",
			"type" : 1,
			"associativity" : null,
			"precedence" : null,
			"operands" : 1
		}

	};
	if (typeof token === "string") {
		token = uOps[token];
	}
	this.txt = token.txt;
	this.operand = operand || null;

	this.associativity = token.associativity;
	this.precedence = token.precedence;

}

Unary.prototype.isVariable = function() {
	return this.operand.isVariable();
};

Unary.prototype.evaluate = function() {
	var operand = this.operand.evaluate();

	var evaluations = {
		"-" : function(operand) {
			return -operand;
		},

		"ln" : function(operand) {
			return Math.log(operand);
		},

		"log" : function(operand) {
			return Math.log(operand) / Math.log(10);
		},

		"sin" : function(operand) {
			return Math.sin(operand);
		},

		"cos" : function(operand) {
			return Math.cos(operand);
		},

		"tan" : function(operand) {
			return Math.tan(operand);
		},

		"csc" : function(operand) {
			return 1 / Math.sin(operand);
		},

		"sec" : function(operand) {
			return 1 / Math.cos(operand);
		},

		"cot" : function(operand) {
			return 1 / Math.tan(operand);
		},

		"arcsin" : function(operand) {
			return Math.asin(operand);
		},

		"arccos" : function(operand) {
			return Math.acos(operand);
		},

		"arctan" : function(operand) {
			return Math.atan(operand);
		},

		"arccsc" : function(operand) {
			return Math.asin(1 / operand);
		},

		"arcsec" : function(operand) {
			return Math.acos(1 / operand);
		},

		"arccot" : function(operand) {
			return Math.atan(1 / operand);
		}
	};
	
	return evaluations[this.txt](operand);
};

Unary.prototype.differentiate = function(){
	var dOperand = this.operand.differentiate();
	var operand = this.operand;
	var derivatives = {
			"-": function(operand) {
				return new Unary("-", dOperand);
			},
			
			"ln": function(operand) {
				return new Binary("/", dOperand, operand);
			},
			
			"log": function(operand) {
				return new Binary("/", dOperand, 
						new Binary("*", operand, 
								new Unary("ln", new Operand("10")
								)
						)
				);
			},
			
			"sin": function(operand) {
				return new Binary("*", 
						new Unary("cos", operand), 
						dOperand		
				);
			},
			
			"cos": function(operand) {
				return new Unary("-", 
						new Binary("*", 
								new Unary("sin", operand), 
								dOperand		
						)
				);
			},
			
			"tan": function(operand) {
				return new Binary("*",
						new Binary("^", 
								new Unary("sec", operand), new Operand("2")),
								dOperand);
			},
			
			"csc": function(operand) {
				return new Binary("*", 
						new Binary("*", 
								new Unary("cot", operand), 
								new Unary("csc", operand)
						), dOperand
				);
			},
			
			"sec": function(operand) {
				return new Binary("*", 
						new Binary("*", 
								new Unary("sec", operand), 
								new Unary("tan", operand)
						), 
						dOperand		
				);
			},
			
			"cot": function(operand) {
				return new Unary("-", 
						new Binary("*", 
								new Binary("^", 
										new Unary("csc", operand), 
										new Operand("2")), dOperand)
				);
			}
	
	};
	
	return derivatives[this.txt](operand);
};