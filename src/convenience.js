function stringifyPostfix(expression){
	var str="";
	var a=shunt(expression);
	for(var i=0;i<a.length;i++){
		str+=a[i].txt+" ";
	}
	return str;
}
function stringy(arr){
	var str="";
	for(var i=0;i<arr.length;i++){
		str+=arr[i].txt+" ";
	}
	return str;
}
function evaluateFunction(expression, variables){
	return Math.round(tree(expression).evaluate(variables)*1e10)/1e10;
}
function differentiateFunction(expression){
	var result = toTex(toTree(shunt(expression)).differentiate());
	document.body.innerHTML = "";
	document.body.innerHTML+=("$$\\frac{d}{dx}\\left(" + toTex(tree(expression)) + "\\right)="  + result+"$$" + "<br>");
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

}
function differentiateFunctionNoSimplify(expression){
	return (stringy(toInfix(toPostfix(derivative(toTree(shunt(expression)))))));

}
function simplifyExpression(expression){
	return simplify(order(toTree(shunt(expression))));
}
function tree(expression){
	return toTree(shunt(expression));
}
function displayTree(tree){
	return stringy(toInfix(toPostfix(tree)));
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

function unitTest(){
	var expression=new Expression("1/2");
	
	console.log(displayTree(expression.tree.makeCommutative()));
}
function solve(first, second, guess) {
	return new Equation(first).solve(new Equation(second), -10, 10, guess);
}
