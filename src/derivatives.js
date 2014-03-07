/* Derivative notes:
 * Expression: f(x)=sin(2*x);
 * Postfix: 2 x * sin
 * Tree: 
 * 		sin
 * 		 |
 * 		 *
 * 		/ \
 *     2   x
 * Derivative: f'(x)=cos(2*x)*2
 * Recursive descent: Treat everything as chain rule?
 * Some pseudocode
 * 	function derivative(tree)
 * 		if tree is operand
 * 			if it is a variable, return 1
 * 			otherwise return 0
 * 		Otherwise if it is an operator
 * 			if it is an addition, subtraction, multiplication, or division operator
 * 				get the two operands 
 * 					create a new node that is the derivative, and set it equal to derivative(tree)
 * 			otherwise if it is an exponent operator

 * 				
 * 
 */