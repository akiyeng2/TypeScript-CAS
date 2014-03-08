function Operator(tok){
	this.type=tok.type;
	this.txt=tok.txt;
	this.numOperands=tok.operands;
	if(this.numOperands==1){
		this.operand;
	}else{
		this.leftOperand;
		this.rightOperand;
	}
	this.evaluate=function(operands,variables){
		var a=operands[0];
		var b=(operands.length==2)?operands[1]:null;
		var right,left;
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
			return left-right
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
			return Math.log(left)/Math.log(10)
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
	this.differentiate=function(operands){
		var left=derivative(operands[0]);
		var right=derivative((operands.length==2)?operands[1]:null);
		
		if(this.txt=="+"){
			var addition=new Operator(tokenize("+")[0]);
			addition.leftOperand=left;
			addition.rightOperand=right;
			return addition;
		}else if(this.txt=="*"){
			var addition=new Operator(tokenize("+")[0]);
			addition.leftOperand=new Operator(tokenize("*")[0]);
			addition.leftOperand.leftOperand=left;
			addition.leftOperand.rightOperand=derivative(right);
			
			addition.rightOperand=new Operator(tokenize("*")[0]);
			addition.rightOperand.leftOperand=right;
			addition.rightOperand.rightOperand=derivative(left);
			return addition;

		}
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
		}else if(tok.txt=="pi" || tok.txt=="π"){
			this.value=Math.PI;
		}else{
			this.value=parseFloat(tok.txt,10);
		}
	}
	
}