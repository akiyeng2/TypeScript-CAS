
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
			return operator("+",tree.left,
					operator("!",tree.right));
		}else if(tree.txt=="/"){
			return operator("*",tree.right)
		}
	}
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
				if(isVariable(tree.left)&&!isVariable(tree.right)){
					var temp=tree.left;
					tree.left=tree.right;
					tree.right=order(temp);
					return tree;
				}else{
					tree.left=order(tree.left);
					tree.right=order(tree.right);
					return tree;
				}
			}
		}
	}
	return tree;
}
function simplify(tree){
	//A warning: This is going to be the ugliest code I have ever written. 
	//Here be dragonic if statements
	
	tree=order(tree);
	if(tree instanceof Operand){

		return tree;
	}else{
	
		if(tree.txt=="+"){
			if(tree.left.txt=="0"){
				tree=simplify(tree.right);
				return tree;
			}
			if(tree.right.txt=="0"){
				tree=simplify(tree.left);
				return tree;
			}
	
		}else if(tree.txt=="*"){
			if(tree.left.txt=="0" || tree.right.txt=="0"){
				tree=operator("0");
				return tree;
			}
			
			if(tree.left.txt=="1"){
				tree=simplify(tree.right);
				return tree;
			}
			if(tree.right.txt=="1"){
				tree=simplify(tree.left);
				return tree;
			}
		}else if(tree.txt=="^"){
			
			if(tree.right.txt=="1"){
				tree=simplify(tree.left);
				return tree;
			}
			if(tree.left.txt=="1" || tree.right.txt=="0"){
				tree=operator("1");
				return tree;
			}else if(tree.left.txt=="0"){
				tree=operator("0");
				return tree;
			}
			
			
		}
		
		
		if(tree.numOperands==1){
			tree.operand=simplify(tree.operand);
		}else{
			tree.left=simplify(tree.left);
			tree.right=simplify(tree.right);
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





