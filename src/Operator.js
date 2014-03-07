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
		if(this.txt=="+"){
			if(a instanceof Operand && b instanceof Operand){
				return a.value+b.value;
			}else if(a instanceof Operator && b instanceof Operand){
				return evaluateTree(a)+b.value;
			}else if(a instanceof Operand && b instanceof Operator){
				return a.value+evaluateTree(b);
			}else{
				return evaluateTree(a)+evaluateTree(b);
			}
			
		}else if(this.txt=="-"){
			
			if(a instanceof Operand && b instanceof Operand){
				return a.value-b.value;
			}else if(a instanceof Operator && b instanceof Operand){
				return evaluateTree(a)-b.value;
			}else if(a instanceof Operand && b instanceof Operator){
				return a.value-evaluateTree(b);
			}else{
				return evaluateTree(a)-evaluateTree(b);
			}
			
			
		}else if(this.txt=="!"){
			
			if(a instanceof Operand){
				return -1*a.value;
				
			}else{
				return -1*evaluateTree(a);
			}
			
		}else if(this.txt=="*"){
			
			if(a instanceof Operand && b instanceof Operand){
				return a.value*b.value;
			}else if(a instanceof Operator && b instanceof Operand){
				return evaluateTree(a)*b.value;
			}else if(a instanceof Operand && b instanceof Operator){
				return a.value*evaluateTree(b);
			}else{
				return evaluateTree(a)*evaluateTree(b);
			}
			
		}else if(this.txt=="/"){
			
			if(a instanceof Operand && b instanceof Operand){
				return a.value/b.value;
			}else if(a instanceof Operator && b instanceof Operand){
				return evaluateTree(a)/b.value;
			}else if(a instanceof Operand && b instanceof Operator){
				return a.value/evaluateTree(b);
			}else{
				return evaluateTree(a)/evaluateTree(b);
			}
			
		}
		else if(this.txt=="^"){
			
			if(a instanceof Operand && b instanceof Operand){
				return Math.pow(a.value,b.value);
			}else if(a instanceof Operator && b instanceof Operand){
				return Math.pow(evaluateTree(a),b.value);
			}else if(a instanceof Operand && b instanceof Operator){
				return Math.pow(a.value,evaluateTree(b));
			}else{
				return Math.pow(evaluateTree(a),evaluateTree(b));
			}
			
		}else if(this.txt=="log"){
			
			if(a instanceof Operand){
				return Math.log(a.value)/Math.log(10);
			}else{
				return Math.log(evaluateTree(a))/Math.log(10);
			}
			
		}else if(this.txt=="ln"){
			
			if(a instanceof Operand){
				return Math.log(a.value);
			}else{
				return Math.log(evaluateTree(a));
			}
			
		}else if(this.txt=="sqrt"){
			
			if(a instanceof Operand){
				return Math.sqrt(a.value);
			}else{
				return Math.sqrt(evaluateTree(a));
			}
			
		}else if(this.txt=="abs"){
		
			if(a instanceof Operand){
				return Math.abs(a.value);
			}else{
				return Math.abs(evaluateTree(a));
			}
			
		}else if(this.txt=="sin"){
			
			if(a instanceof Operand){
				return Math.sin(a.value);
			}else{
				return Math.sin(evaluateTree(a));
			}
			
		}else if(this.txt=="cos"){
			
			if(a instanceof Operand){
				return Math.cos(a.value);
			}else{
				return Math.cos(evaluateTree(a));
			}
			
		}else if(this.txt=="tan"){
			
			if(a instanceof Operand){
				return Math.tan(a.value);
			}else{
				return Math.tan(evaluateTree(a));
			}
			
		}else if(this.txt=="csc"){
			
			if(a instanceof Operand){
				return 1/Math.sin(a.value);
			}else{
				return 1/Math.sin(evaluateTree(a));
			}
			
		}else if(this.txt=="sec"){
			
			if(a instanceof Operand){
				return 1/Math.cos(a.value);
			}else{
				return 1/Math.cos(evaluateTree(a));
			}
			
		}else if(this.txt=="cot"){
			
			if(a instanceof Operand){
				return 1/Math.cot(a.value);
			}else{
				return 1/Math.cot(evaluateTree(a));
			}
			
		}else if(this.txt=="arcsin"){
		
			if(a instanceof Operand){
				return Math.asin(a.value);
			}else{
				return Math.asin(evaluateTree(a));
			}
			
		}else if(this.txt=="arccos"){
			
			if(a instanceof Operand){
				return Math.acos(a.value);
			}else{
				return Math.acos(evaluateTree(a));
			}
		
		}else if(this.txt=="arctan"){
			
			if(a instanceof Operand){
				return Math.atan(a.value);
			}else{
				return Math.atan(evaluateTree(a));
			}
			
		}else if(this.txt="arccsc"){
			
			if(a instanceof Operand){
				return Math.asin(1/a.value);
			}else{
				return Math.asin(1/evaluateTree(a));
			}
			
		}else if(this.txt="arcsec"){
			
			if(a instanceof Operand){
				return Math.acos(1/a.value);
			}else{
				return Math.acos(1/evaluateTree(a));
			}
			
		}else if(this.txt="arccot"){
			
			if(a instanceof Operand){
				return Math.atan(1/a.value);
			}else{
				return Math.atan(1/evaluateTree(a));
			}
			
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