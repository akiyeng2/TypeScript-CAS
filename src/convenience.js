function stringifyPostfix(expression) {
	var str = "";
	var a = shunt(expression);
	for ( var i = 0; i < a.length; i++) {
		str += a[i].txt + " ";
	}
	return str;
}
function stringy(arr) {
	var str = "";
	for ( var i = 0; i < arr.length; i++) {
		str += arr[i].txt + " ";
	}
	return str;
}
function evaluateFunction(expression) {
	return Math.round(evaluateTree(toTree(shunt(expression))) * 1e10) / 1e10;
}
function differentiateFunction(expression) {
	return (stringy(toInfix(toPostfix(simplifier(derivative(toTree(shunt(expression))))))))
			.slice(0, -1);
}
function differentiateFunctionNoSimplify(expression) {
	return (stringy(toInfix(toPostfix(derivative(toTree(shunt(expression)))))));

}
function simplifyExpression(expression) {
	return simplify(order(toTree(shunt(expression))));
}
function tree(expression) {
	return toTree(shunt(expression));
}
function displayTree(tree) {
	return stringy(toInfix(toPostfix(tree)));
}

function evaluateTree(tree, variables) {

	if (tree instanceof Operand) {
		return tree.value;
	}
	if (tree.leftOperand !== undefined) {
		return tree.evaluate();

	} else {

		return tree.evaluate();
	}
}

function unitTest() {
	var expression = new Expression("1/2");

	console.log(displayTree(expression.tree.makeCommutative()));
}