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
function getInfo(eqn, lower, upper, subintervals) {
	var eqn = (typeof eqn === "string"? new Equation(eqn) : eqn);
	var criticals = eqn.criticals(lower, upper, (subintervals || 100));
	var increasing = [];
	var decreasing = [];
	for(var i = 0; i < criticals.length; i++) {
		if(criticals[i].sign == 1) {
			increasing.push(criticals[i]);
		}else{
			decreasing.push(criticals[i]);
		}
	}
	document.body.innerHTML = "";
	document.body.innerHTML+=("${\nf(x)=" + toTex(eqn.tree))+"}$<br><br>";
	var incIntervals = "";
	
	for(var i = 0; i < increasing.length; i++) {

		incIntervals+=("(" + Math.round(increasing[i].lower*1e5)/1e5 + ",\\nobreakspace" + Math.round(increasing[i].upper*1e5)/1e5+")\\cup");
	}

	var decIntervals = "";
	
	for(var i = 0; i < decreasing.length; i++) {

		decIntervals+=("(" + Math.round(decreasing[i].lower*1e5)/1e5 + ",\\nobreakspace" + Math.round(decreasing[i].upper*1e5)/1e5+")\\cup");
	}
	
	document.body.innerHTML += "$\\text{Increasing: } " + incIntervals.slice(0, -4) + "\\\\";
	document.body.innerHTML += "\\text{Decreasing: } " + decIntervals.slice(0, -4) + "$";

	var inflections = eqn.differentiate().criticals(lower, upper, (subintervals || 100));
	
	var ccup = [];
	var ccdown = [];
	for(var i = 0; i < inflections.length; i++) {
		if(inflections[i].sign == 1) {
			ccup.push(inflections[i]);
		}else{
			ccdown.push(inflections[i]);
		}
	}
	var ccUpIntervals = "";
	
	for(var i = 0; i < ccup.length; i++) {

		ccUpIntervals+=("(" + Math.round(ccup[i].lower*1e5)/1e5 + ",\\nobreakspace" + Math.round(ccup[i].upper*1e5)/1e5+")\\cup");
	}

	var ccDownIntervals = "";
	
	for(var i = 0; i < ccdown.length; i++) {

		ccDownIntervals+=("(" + Math.round(ccdown[i].lower*1e5)/1e5 + ",\\nobreakspace" + Math.round(ccdown[i].upper*1e5)/1e5+")\\cup");
	}

	document.body.innerHTML += "<br><br>$\\text{Concave Up: } " + ccUpIntervals.slice(0, -4) + "\\\\";
	document.body.innerHTML += "\\text{Concave Down: } " + ccDownIntervals.slice(0, -4) + "$";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}