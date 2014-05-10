function isVariable(tree){
	if(tree instanceof Operand){
		return (tree.isVariable);
	}else if(tree.numOperands==2){
		return (isVariable(tree.left)||isVariable(tree.right));
	}else{
		return isVariable(tree.operand);
	}
}
function operator(str,left,right){
	if(str==="!"){
		var op=new Operator(tokenize("-")[0]);
		op.operand=left;

		return op;
	}
	var token=tokenize(str)[0];
	if(token.type===0||token.type===5){

		return new Operand(token);
	}

	if(str==="-"){

		var op=new Operator(tokenize("1-")[1]);
		op.left=left;
		op.right=right;
		return op;
	}

	op=new Operator(token);
	if(op.numOperands==2){
		op.left=left;
		op.right=right;
	}else{
		op.operand=left;
	}
	return op;
}

function unaryOperator(token, operand) {
	var uOps = {
			"!": {"id": 5, "txt":"!", "type": 4, "associativity": 1, "precedence":50, "operands":1},
			"sin": {"id": 1, "txt":"sin", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"cos": {"id": 1, "txt":"cos", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"tan": {"id": 1, "txt":"tan", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"csc": {"id": 1, "txt":"csc", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"sec": {"id": 1, "txt":"sec", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"cot": {"id": 1, "txt":"cot", "type": 1, "associativity": null, "precedence": null, "operands": 1},

			"arcsin": {"id": 1, "txt":"arcsin", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"arccos": {"id": 1, "txt":"arccos", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"arctan": {"id": 1, "txt":"arctan", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"arccsc": {"id": 1, "txt":"arccsc", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"arcsec": {"id": 1, "txt":"arcsec", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"arccot": {"id": 1, "txt":"arccot", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			
			"log": {"id": 1, "txt":"log", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"ln": {"id": 1, "txt":"ln", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"sqrt": {"id": 1, "txt":"sqrt", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"abs": {"id": 1, "txt":"abs", "type": 1, "associativity": null, "precedence": null, "operands": 1},
			"log": {"id": 1, "txt":"log", "type": 1, "associativity": null, "precedence": null, "operands": 1}
			

	}
	if(typeof token === "string") {
		token = uOps[token];
	}
	
	this.txt = token.txt;
	this.operand = operand || null;
	
	this.associativity = token.associativity;
	this.precedence = token.precedence;
	
	
}

function binaryOperator(token, left, right) {
	
	var bOps = {
			"+": {"id":4,"txt":"+","type":4,"associativity":0,"precedence":1,"operands":2},
			"-": {"id":5,"txt":"!","type":4,"associativity":1,"precedence":50,"operands":1},
			"*": {"id":6,"txt":"*","type":4,"associativity":0,"precedence":5,"operands":2},
			"/": {"id":7,"txt":"/","type":4,"associativity":0,"precedence":5,"operands":2}
			"^": {"id":8,"txt":"^","type":4,"associativity":1,"precedence":10,"operands":2}
	}
	
	if(typeof token === "string") {
		token = bOps[token];
	}
	this.txt = token.txt;
	this.left = left || null;
	this.right = right || null;
	
	this.associativity = token.associativity;
	this.precedence = token.precedence;
}

function Operator(tok){
	
	this.type=tok.type;
	this.txt=tok.txt;
	this.numOperands=tok.operands;

	if(this.numOperands==1){
		this.operand;
	}else{
		this.left;
		this.right;
	}
	
}
Operator.prototype.toString=function(){
	return displayTree(this);
	
};
Operator.prototype.evaluate=function(variables){
	if(this.numOperands==1){
		var left=this.operand.evaluate();
	}else{
	// console.log(this);
		var left=this.left.evaluate();
		var right=this.right.evaluate();
	}
	if(this.txt=="+"){
		return left+right;
	}else if(this.txt=="-"){
		return left-right;
	}else if(this.txt=="!"){
		return -1*left;
	}else if(this.txt=="*"){
		return left*right;
	}else if(this.txt=="/"){
		return left/right;
	}
	else if(this.txt=="^"){
		return Math.pow(left,right);
	}else if(this.txt=="log"){
		return Math.log(left)/Math.log(10);
	}else if(this.txt=="ln"){
		return Math.log(left);
	}else if(this.txt=="sqrt"){
		return Math.sqrt(left);
	}else if(this.txt=="abs"){
		return Math.abs(left);
	}else if(this.txt=="sin"){
		return Math.sin(left);
	}else if(this.txt=="cos"){
		return Math.cos(left);
	}else if(this.txt=="tan"){
		return Math.tan(left);
	}else if(this.txt=="csc"){
		return 1/Math.sin(left);
	}else if(this.txt=="sec"){
		return 1/Math.cos(left);
	}else if(this.txt=="cot"){
		return 1/Math.tan(left);
	}else if(this.txt=="arcsin"){
		return Math.asin(left);
	}else if(this.txt=="arccos"){
		return Math.acos(left);
	}else if(this.txt=="arctan"){
		return Math.atan(left);
	}else if(this.txt="arccsc"){
		return Math.asin(1/left);
	}else if(this.txt="arcsec"){
		return Math.acos(1/left);
	}else if(this.txt="arccot"){
		return Math.atan(1/left);
	}	
};
Operator.prototype.toString=function(){
	return stringy(toInfix(toPostfix(tree)));

}
Operator.prototype.differentiate=function(){
	var left=null,right=null;
	if(this.numOperands==1){
		left=this.operand;
	}else{
		left=this.left;
		right=this.right;
	}
	if(this.txt=="+"){
		result=operator("+",left.differentiate(),right.differentiate());
	}else if(this.txt=="*"){

		result=operator("+",
				operator("*",left,right.differentiate()),
				operator("*",right,left.differentiate())
		);
	}else if(this.txt=="-"){
		result=operator("-",left.differentiate(),right.differentiate());
	}else if(this.txt=="/"){
		result=operator("/",
				operator("-",
						operator("*",right,left.differentiate()),
						operator("*",left,right.differentiate())
				),operator("^",right,operator("2"))
		);
	}else if(this.txt=="^"){
		/*
		 * OK how do I am do derivatives y=(2*x)^3 dy/dx=(3*(2*x)^2)*2
		 * 
		 * y=(e)^(2*x) dy/dx=e^(2*x)*ln(e)*2
		 */

		var powerRule=operator("*", 
				operator("*",right, 
						operator("^",left, 
								operator("-",right, 
										operator("1")
								)
						)
				),
				left.differentiate()
		);
		var exponentRule=operator("*",
				operator("*",
						operator("^",left,right),
						operator("ln",left)),right.differentiate());
		if(isVariable(left) && !isVariable(right)){
			result= powerRule;
		}else if(!isVariable(left) && isVariable(right)){
			result=exponentRule;
		}else{
			result= operator("+",powerRule,exponentRule);
		}




	}else if(this.txt=="!"){			
		result=operator("!",left.differentiate());
	}else if(this.txt=="ln"){
		result=operator("/",left.differentiate(),left);
	}else if(this.txt=="log"){
		result=operator("/",left.differentiate(),operator("*",left,operator("ln",operator("10"))));
	}else if(this.txt=="sqrt"){
		result=operator("/",left.differentiate(),
				operator("*",
						operator("2"),
						operator("sqrt",left)));
	}
	else if(this.txt=="sin"){
		result=operator("*",
				operator("cos",left),left.differentiate());
	}else if(this.txt=="cos"){
		result=operator("*",
				operator("!",
						operator("sin",left)),left.differentiate());
	}else if(this.txt=="tan"){
		result=operator("*",
				operator("^",
						operator("sec",left),operator("2")),left.differentiate());
	}else if(this.txt=="csc"){
		result=operator("*",
				operator("!",
						operator("*",
								operator("csc",left),
								operator("cot",left))),left.differentiate());
	}else if(this.txt=="sec"){
		result=operator("*",
				operator("*",
						operator("sec",left),
						operator("tan",left)),left.differentiate());
	}else if(this.txt=="cot"){
		result=operator("!",operator("*",operator("^",operator("csc",left),operator("2")),left.differentiate()));
	}else if(this.txt=="arcsin"){
		result=operator("/",left.differentiate(),
				operator("sqrt",
						operator("-",operator("1"),
								operator("^",left,operator("2")))));
	}else if(this.txt=="arccos"){
		result=operator("!",
				operator("/",left.differentiate(),
						operator("sqrt",
								operator("-",operator("1"),
										operator("^",left,operator("2"))))));
	}else if(this.txt=="arctan"){
		result=operator("/",
				left.differentiate(),
				operator("+",
						operator("1"),
						operator("^",left,operator("2"))));
	}else if(this.txt=="arcsec"){
		result=operator("/",left.differentiate(),
				operator("*",
						operator("abs",left),
						operator("sqrt",
								operator("-",operator("^",left,operator("2")),operator("1")))));
	}else if(this.txt=="arccsc"){
		result=operator("!", 
				operator("/",left.differentiate(),
						operator("*",
								operator("abs",left),
								operator("sqrt",
										operator("-",operator("^",left,operator("2")),operator("1"))))));
	}else if(this.txt=="arccot"){
		result=operator("!",operator("/",
				left.differentiate(),
				operator("+",
						operator("1"),
						operator("^",left,operator("2")))));
	}
	return result;
};
