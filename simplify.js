function equals(tree1,tree2){

}
function order(tree){
	if(tree instanceof Operand){
		return tree;
	}else{
		if(tree.numOperands==1){
			return order(tree);
		}else{
			if(isVariable(tree.leftOperand)&&!isVariable(tree.rightOperand)){
				var temp=tree.leftOperand;
				tree.leftOperand=tree.rightOperand;
				tree.rightOperand=order(temp);
				return tree;
			}else{
				tree.leftOperand=order(tree.leftOperand);
				tree.rightOperand=order(tree.rightOperand);
				return tree;
			}
		}
	}
	return tree;
}
function simplify(tree){
	//A warning: This is going to be the ugliest code I have ever written. 
	//Here be dragonic if statements
	if(tree instanceof Operand){
		return tree;
	}else{
		if(!isVariable(tree)){
			return operator(evaluateTree(tree));
		}else{
			if(tree.txt=="+"){
				
			}
		}
	}
	
	
}
function simplifyExpression(expression){
	return simplify(order(toTree(shunt(expression))));
}