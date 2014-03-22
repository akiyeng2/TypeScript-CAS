function decimalPlaces(number) {
	return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length
}
function equals(tree1,tree2){
//	if(tree1 instanceof Operator)
}
function makeCommutative(tree){
	if(tree instanceof Operand){
		return tree;
	}else{
		if(tree.txt=="-"){
			var left=tree.leftOperand;
			var right=tree.rightOperand;
			tree=new operator("+",left,
					new operator("!",right));
			return makeCommutative(tree);
		}if(tree.txt=="/"){
			var left=tree.leftOperand;
			var right=tree.rightOperand;
			tree=new operator("*",left,
					new operator("^",right,new operator("-1")));
			return makeCommutative(tree);
		}
	}
	return tree;
}
function order(tree){
	if(tree instanceof Operand){
		return tree;
	}else{
		if(tree.numOperands==1){
			tree.operand=order(tree.operand);
			return tree;
		}else{
			if(tree.txt=="*" || tree.txt=="+"){
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
	}
	return tree;
}
function simplify(tree){
	
	tree=order(tree);
	if(tree instanceof Operand){

		return tree;
	}else{
	
		if(tree.txt=="+"){
			if(tree.leftOperand.txt=="0"){
				tree=simplify(tree.rightOperand);
				return tree;
			}
			if(tree.rightOperand.txt=="0"){
				tree=simplify(tree.leftOperand);
				return tree;
			}
	
		}else if(tree.txt=="*"){
			if(tree.leftOperand.txt=="0" || tree.rightOperand.txt=="0"){
				tree=operator("0");
				return tree;
			}
			
			if(tree.leftOperand.txt=="1"){
				tree=simplify(tree.rightOperand);
				return tree;
			}
			if(tree.rightOperand.txt=="1"){
				tree=simplify(tree.leftOperand);
				return tree;
			}
		}else if(tree.txt=="^"){
			
			if(tree.rightOperand.txt=="1"){
				tree=simplify(tree.leftOperand);
				return tree;
			}
			if(tree.leftOperand.txt=="1" || tree.rightOperand.txt=="0"){
				tree=operator("1");
				return tree;
			}else if(tree.leftOperand.txt=="0"){
				tree=operator("0");
				return tree;
			}
			
			
		}
		
		
		if(tree.numOperands==1){
			tree.operand=simplify(tree.operand);
		}else{
			tree.leftOperand=simplify(tree.leftOperand);
			tree.rightOperand=simplify(tree.rightOperand);
		}
	
	}
	return tree;
	
	
}
function simplifier(tree){
	var lastTree=tree;
	do{
		lastTree=tree;
		tree=simplify(tree);
		
	}while(displayTree(tree)!=displayTree(lastTree));
	return lastTree;
}





