function Expression(tree,variables){
	this.tree=tree;
	this.variables=variables;
	
}
/**
 * This evaluates a tree through recursive descent and returns a number
 * @todo Implement variables
 * 
 * @param variables The variables
 * @returns The numerical result of the evaluation
 */
Expression.prototype.evaluate=function(variables){
	var a=null,b=null;
	if(this.tree.numOperands==1){
		a=this.tree.operand;
	}else{
		a=this.tree.left;
		b=this.tree.right;
	}
	var right=null,left=null;
	if(a instanceof Operand){
		left=a.value;
	}else{
		left=evaluateTree(a);
	}
	if(b!==null){
		if(b instanceof Operand){
			right=b.value;
		}else{
			right=evaluateTree(b);
		}
	}
	if(this.tree.txt=="+"){
		return left+right;
	}else if(this.tree.txt=="-"){
		return left-right;
	}else if(this.tree.txt=="!"){
		return -1*left;
	}else if(this.tree.txt=="*"){
		return left*right;
	}else if(this.tree.txt=="/"){
		return left/right;
	}
	else if(this.tree.txt=="^"){
		return Math.pow(left,right);
	}else if(this.tree.txt=="log"){
		return Math.log(left)/Math.log(10);
	}else if(this.tree.txt=="ln"){
		return Math.log(left);
	}else if(this.tree.txt=="sqrt"){
		return Math.sqrt(left);
	}else if(this.tree.txt=="abs"){
		return Math.abs(left);
	}else if(this.tree.txt=="sin"){
		return Math.sin(left);
	}else if(this.tree.txt=="cos"){
		return Math.cos(left);
	}else if(this.tree.txt=="tan"){
		return Math.tan(left);
	}else if(this.tree.txt=="csc"){
		return 1/Math.sin(left);
	}else if(this.tree.txt=="sec"){
		return 1/Math.cos(left);
	}else if(this.tree.txt=="cot"){
		return 1/Math.tan(left);
	}else if(this.tree.txt=="arcsin"){
		return Math.asin(left);
	}else if(this.tree.txt=="arccos"){
		return Math.acos(left);
	}else if(this.tree.txt=="arctan"){
		return Math.atan(left);
	}else if(this.tree.txt="arccsc"){
		return Math.asin(1/left);
	}else if(this.tree.txt="arcsec"){
		return Math.acos(1/left);
	}else if(this.tree.txt="arccot"){
		return Math.PI/2-Math.atan(left);
	}	
	
};
Expression.prototype.differentiate=function(){
	var left=null,right=null;
	if(this.tree.numOperands==1){
		left=this.tree.operand;
	}else{
		left=this.tree.left;
		right=this.tree.right;
	}
	if(this.tree.txt=="+"){
		result=operator("+",derivative(left),derivative(right));
	}else if(this.tree.txt=="*"){
		result=operator("+",
				operator("*",left,derivative(right)),
				operator("*",right,derivative(left))
		);
	}else if(this.tree.txt=="-"){
		
		result=operator("-",derivative(left),derivative(right));
		
	}else if(this.tree.txt=="/"){
		
		result=operator("/",
				operator("-",
						operator("*",right,derivative(left)),
						operator("*",left,derivative(right))
				),operator("^",right,operator("2"))
		);
	}else if(this.tree.txt=="^"){

		var powerRule=operator("*", 
				operator("*",right, 
						operator("^",left, 
								operator("-",right, 
										operator("1")
								)
						)
				),
				derivative(left)
		);
		var exponentRule=operator("*",
				operator("*",
						operator("^",left,right),
						operator("ln",left)),derivative(right));
		if(isVariable(left) && !isVariable(right)){
			result= powerRule;
		}else if(!isVariable(left) && isVariable(right)){
			result=exponentRule;
		}else{
			result= operator("+",powerRule,exponentRule);
		}




	}else if(this.tree.txt=="!"){			
		result=operator("!",derivative(left));
	}else if(this.tree.txt=="ln"){
		result=operator("/",derivative(left),left);
	}else if(this.tree.txt=="log"){
		result=operator("/",derivative(left),operator("*",left,operator("ln",operator("10"))));
	}else if(this.tree.txt=="sqrt"){
		result=operator("/",derivative(left),
				operator("*",
						operator("2"),
						operator("sqrt",left)));
	}
	else if(this.tree.txt=="sin"){
		result=operator("*",
				operator("cos",left),derivative(left));
	}else if(this.tree.txt=="cos"){
		result=operator("*",
				operator("!",
						operator("sin",left)),derivative(left));
	}else if(this.tree.txt=="tan"){
		result=operator("*",
				operator("^",
						operator("sec",left),operator("2")),derivative(left));
	}else if(this.tree.txt=="csc"){
		result=operator("*",
				operator("!",
						operator("*",
								operator("csc",left),
								operator("cot",left))),derivative(left));
	}else if(this.tree.txt=="sec"){
		result=operator("*",
				operator("*",
						operator("sec",left),
						operator("tan",left)),derivative(left));
	}else if(this.tree.txt=="cot"){
		result=operator("!",operator("*",operator("^",operator("csc",left),operator("2")),derivative(left)));
	}else if(this.tree.txt=="arcsin"){
		result=operator("/",derivative(left),
				operator("sqrt",
						operator("-",operator("1"),
								operator("^",left,operator("2")))));
	}else if(this.tree.txt=="arccos"){
		result=operator("!",
				operator("/",derivative(left),
						operator("sqrt",
								operator("-",operator("1"),
										operator("^",left,operator("2"))))));
	}else if(this.tree.txt=="arctan"){
		result=operator("/",
				derivative(left),
				operator("+",
						operator("1"),
						operator("^",left,operator("2"))));
	}else if(this.tree.txt=="arcsec"){
		result=operator("/",derivative(left),
				operator("*",
						operator("abs",left),
						operator("sqrt",
								operator("-",operator("^",left,operator("2")),operator("1")))));
	}else if(this.tree.txt=="arccsc"){
		result=operator("!", 
				operator("/",derivative(left),
						operator("*",
								operator("abs",left),
								operator("sqrt",
										operator("-",operator("^",left,operator("2")),operator("1"))))));
	}else if(this.tree.txt=="arccot"){
		result=operator("!",operator("/",
				derivative(left),
				operator("+",
						operator("1"),
						operator("^",left,operator("2")))));
	}
	return result;
};