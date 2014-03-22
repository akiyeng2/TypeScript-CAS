function isVariable(tree){
	if(tree instanceof Operand){
		return (tree.isVariable);
	}else if(tree.numOperands==2){
		return (isVariable(tree.leftOperand)||isVariable(tree.rightOperand));
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
		op.leftOperand=left;
		op.rightOperand=right;
		return op;
	}

	op=new Operator(token);
	if(op.numOperands==2){
		op.leftOperand=left;
		op.rightOperand=right;
	}else{
		op.operand=left;
	}
	return op;
}

function Operator(tok){
	this.type=tok.type;
	this.txt=tok.txt;
	this.numOperands=tok.operands;
	this.precedence=tok.precedence;
	this.associativity=tok.associativity;

	if(this.numOperands==1){
		this.operand;
	}else{
		this.leftOperand;
		this.rightOperand;
	}

	this.evaluate=function(variables){
		var a=null,b=null;
		if(this.numOperands==1){
			a=this.operand;
		}else{
			a=this.leftOperand;
			b=this.rightOperand;
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


	this.differentiate=function(){
		var left=null,right=null;
		if(this.numOperands==1){
			left=this.operand;
		}else{
			left=this.leftOperand;
			right=this.rightOperand;
		}
		if(this.txt=="+"){
			result=operator("+",derivative(left),derivative(right));
		}else if(this.txt=="*"){
			result=operator("+",
					operator("*",left,derivative(right)),
					operator("*",right,derivative(left))
			);
		}else if(this.txt=="-"){
			result=operator("-",derivative(left),derivative(right));
		}else if(this.txt=="/"){
			result=operator("/",
					operator("-",
							operator("*",right,derivative(left)),
							operator("*",left,derivative(right))
					),operator("^",right,operator("2"))
			);
		}else if(this.txt=="^"){
			/*
			 * OK how do I am do derivatives
			 * y=(2*x)^3
			 * dy/dx=(3*(2*x)^2)*2
			 * 
			 * y=(e)^(2*x)
			 * dy/dx=e^(2*x)*ln(e)*2
			 */

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




		}else if(this.txt=="!"){			
			result=operator("!",derivative(left));
		}else if(this.txt=="ln"){
			result=operator("/",derivative(left),left);
		}else if(this.txt=="log"){
			result=operator("/",derivative(left),operator("*",left,operator("ln",operator("10"))));
		}else if(this.txt=="sqrt"){
			result=operator("/",derivative(left),
					operator("*",
							operator("2"),
							operator("sqrt",left)));
		}
		else if(this.txt=="sin"){
			result=operator("*",
					operator("cos",left),derivative(left));
		}else if(this.txt=="cos"){
			result=operator("*",
					operator("!",
							operator("sin",left)),derivative(left));
		}else if(this.txt=="tan"){
			result=operator("*",
					operator("^",
							operator("sec",left),operator("2")),derivative(left));
		}else if(this.txt=="csc"){
			result=operator("*",
					operator("!",
							operator("*",
									operator("csc",left),
									operator("cot",left))),derivative(left));
		}else if(this.txt=="sec"){
			result=operator("*",
					operator("*",
							operator("sec",left),
							operator("tan",left)),derivative(left));
		}else if(this.txt=="cot"){
			result=operator("!",operator("*",operator("^",operator("csc",left),operator("2")),derivative(left)));
		}else if(this.txt=="arcsin"){
			result=operator("/",derivative(left),
					operator("sqrt",
							operator("-",operator("1"),
									operator("^",left,operator("2")))));
		}else if(this.txt=="arccos"){
			result=operator("!",
					operator("/",derivative(left),
							operator("sqrt",
									operator("-",operator("1"),
											operator("^",left,operator("2"))))));
		}else if(this.txt=="arctan"){
			result=operator("/",
					derivative(left),
					operator("+",
							operator("1"),
							operator("^",left,operator("2"))));
		}else if(this.txt=="arcsec"){
			result=operator("/",derivative(left),
					operator("*",
							operator("abs",left),
							operator("sqrt",
									operator("-",operator("^",left,operator("2")),operator("1")))));
		}else if(this.txt=="arccsc"){
			result=operator("!", 
					operator("/",derivative(left),
							operator("*",
									operator("abs",left),
									operator("sqrt",
											operator("-",operator("^",left,operator("2")),operator("1"))))));
		}else if(this.txt=="arccot"){
			result=operator("!",operator("/",
					derivative(left),
					operator("+",
							operator("1"),
							operator("^",left,operator("2")))));
		}
		return result;
	};
}
function Operand(tok){
		
	if(tok.type==0){
		this.isVariable=true;
		this.value=null;
	}else if(tok.type==5){
		this.isVariable=false;
		if(tok.txt=="e"){
			this.value=Math.E;
		}else if(tok.txt=="pi" || tok.txt=="��"){
			this.value=Math.PI;
		}else{
			this.value=parseFloat(tok.txt,10);
		}
	}
	this.txt=tok.txt;

}