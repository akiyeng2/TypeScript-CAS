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
function differentiateFunction(expression, wrt){
	var result = toTex(toTree(shunt(expression)).differentiate(wrt));
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
function getInfo(eqn, lower, upper, wrt, subintervals) {
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

	var inflections = eqn.differentiate(wrt || "x").criticals(lower, upper, (subintervals || 100));
	
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
function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function eqn (str) {
	return new Equation(str);
}

Math.pow_ = Math.pow;

//redefine the method
Math.pow = function(_base, _exponent) {
    if (_base < 0) {
        if (Math.abs(_exponent) < 1) {
            //we're calculating nth root of _base, where n === 1/_exponent
            if (1 / _exponent % 2 === 0) {
                //nth root of a negative number is imaginary when n is even, we could return
                //a string like "123i" but this would completely mess up further computation
                return NaN;
            }
            //nth root of a negative number when n is odd
            return -Math.pow_(Math.abs(_base), _exponent);
        }
    } /*else if _base >=0*/
    //run the original method, nothing will go wrong
    return Math.pow_(_base, _exponent);
};

//Thanks to @o.v. for providing this code at 
//http://stackoverflow.com/a/12813002/2027567