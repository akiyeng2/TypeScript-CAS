function decimalPlaces(number) {
	return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length
}
function equals(tree1,tree2){
//	if(tree1 instanceof Operator)
}
Operator.prototype.makeCommutative=function(){
	if(this.txt=="-"){
		this.txt=="+";
		this.left=this.left.makeCommutative();
		this.right=operator("!",this.right.makeCommutative());

		
	}else if(this.txt=="/"){
		this=operator("*",this.left.makeCommutative(),
				operator("^",this.right.makeCommutative(),
						operator("!",operator("1"))));
	}
	return this;
}

Operand.prototype.makeCommutative=function(){
	return this;
};



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
/*
 * Original: 1+2+3*4*5
 * Desired:  add(1,2,multiply(3,4,5))
 * 
 *  Tree:
 *  
 *  	+
 *     / \
 *    1   +
 *       / \
 *      2   *
 *         / \
 *        3   *
 *           / \
 *          4   5
 *          
 *  Desired tree:
 *  
 *  		+
 *        / | \
 *       1  2  *
 *           / | \
 *          3  4  5
 *  Start with an empty array
 *  function operand.addition(array){
 *  	return this
 *  }
 *  function operator.addition(array)    
 *  	if this is addition
 *  		push left.addition(array) and right.addition(array) to the array
 *  	otherwise
 *  		push this onto the array
 *  		set operands to [left.addition([]),right.addition([])]
 *  		
 *  	
 *  	
 */           
 
Operator.prototype.standardize=function(){
	
}

Operand.prototype.standardize=function(){
	return this;
}
