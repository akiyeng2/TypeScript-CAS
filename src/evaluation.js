function evaluateTree(tree,variables){

	if(tree instanceof Operand){
		return tree.value;
	}
	if(tree.leftOperand!==undefined){
		return tree.evaluate();

	}else{

		return tree.evaluate();
	}
}