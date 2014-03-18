


/*
 * Converting a postfix array into a syntax tree
 * Example: 
 * 	Infix: 1+(2*3)
 * 	Postfix: 1 2 3 * +
 * 	Desired Tree:
 *  	+
 *     / \
 *    1   *
 *        /\
 *       2  3
 * 
 * Slightly more complicated algorithm
 *  Infix: 1+(2*3)/sin(4)
 *  Postfix: 1 2 3 * 4 sin / +
 *  Human running algorithm:
 *  Stack: [] 
 *  Push values until operator reached
 *  Stack: [1,2,3]
 *  Operator reached: *, takes two arguments
 *   pop two values off of stack, create new operator from that, push
 *   Stack: [1,multiply(2,3)]
 *  Read until operator
 *   Stack: [1,multiply(2,3),4]
 *  Operator reached (sin), takes 1 argument
 *   Pop one value of of stack, create new operator, push
 *   Stack[1,multiply(2,3),sin(4)]
 *  Operator reached (/), takes two arguments
 *   Stack[1,divide(multiply(2,3),sin(4))]
 *  Operator reached (+), takes two arguments
 *   	
 *  And we are done
 *  
 *  Tree derived from that
 *  			add
 *             /   \
 *            1   divide  
 *               /      \
 *            multiply   sin
 *           /        \    \
 *          2          3    4
 *          
 *          
 * Algorithm derived (slight modification from the normal Postfix)
 * 		1. Create empty stack
 * 		2. Iterate through postfix tokens
 * 			a. If token is a value (number, variable)
 * 				i. Push it to stack
 * 			b. If it is a function or operator
 * 				i. Create new operator instance`
 * 				ii. Determine how many operands the function or operator takes, henceforth known as n
 * 				iii. Pop n values from the stack, and set them as the operands of the operator
 * 				iv. Push the operator back onto the stack
 *		3. Error handling	
 *			a. If there is one value on the stack, it is your tree, with an operator as the head element
 *			b. Otherwise, we screwed up 
 */        
function toTree(array){
	var VARIABLE=0;
	var FUNCTION=1;
	var OPERATOR=4;
	var NUMBER=5;
	var stack=new Stack();
	for(var i=0;i<array.length;i++){
		var token=array[i];
		if(token.type==VARIABLE || token.type==NUMBER){
			stack.push(new Operand(token));
		}else if (token.type==FUNCTION || token.type==OPERATOR){
			var operator=new Operator(token);
			
			var numOperands=operator.numOperands;
			if(numOperands==1){
				operator.operand=stack.pop();
			}else{
				var right=stack.pop();
				var left=stack.pop();
				operator.leftOperand=left;
				operator.rightOperand=right;
			}
			stack.push(operator);
		}
	}
	if(stack.length()==1){
		return stack.pop();
	}else{
		throw new Error("We screwed up somewhere");
	}
}
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
function evaluateFunction(expression){
	return evaluateTree(toTree(shunt(expression)));
}
function stringify(expression){
	var str="";
	var a=shunt(expression);
	for(var i=0;i<a.length;i++){
		str+=a[i].txt+" ";
	}
	return str;
	

}

/*
 * We haz tree
 *              add
 *             /   \
 *            1   divide  
 *               /      \
 *              4        2
 * 
 * wanted result:
 * add 1 divide 4 2
 * We haz a stack
 *  if it is an operator
 * 		push it to the stack
 * 		push left and right to the stack as well
 *  otherwise
 *  	push the tree to the stack
 */

function postfix(tree,stack){
//	console.log(stack.getArray());
	
	if(tree instanceof Operand){
		stack.push(tree);
	}else if(tree instanceof Operator){
		if(tree.numOperands==2){
			var left=postfix(tree.leftOperand,stack);
			var right=postfix(tree.rightOperand,stack);
			stack.push(left,right);
			stack.push(tree);
		}else{
			var left=postfix(tree.operand,stack);
			stack.push(left);
			stack.push(tree);
		}

	
	}
	return stack;

}
function toPostfix(tree){
	var arr=postfix(tree,new Stack());
	var array=[];
	while(!arr.empty()){
		var steve=arr.pop();
		if(!(steve instanceof Stack)){
			array.push(steve);
		}
	}
	return array.reverse();
}

function toInfix(postfix){
//	console.log(postfix);
	var stack=new Stack();

	for(var i=0;i<postfix.length;i++){
		var token=postfix[i];
		if(token instanceof Operand){
			stack.push(token);
		}else{
			var op=new Operator(token);

			if(token.numOperands==2){

				var right=stack.pop();

				var left=stack.pop();	
				op.leftOperand=left;
				op.rightOperand=right;
				
				op.txt="("+left.txt+token.txt+right.txt+")";
			}else{
				
				var left=stack.pop();
				op.operand=left;
			
				op.txt=op.txt+"("+left.txt+")";
			}
			stack.push(op);
		}

	}
	return stack.getArray();
}	