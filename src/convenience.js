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
function evaluateFunction(expression){
	return evaluateTree(toTree(shunt(expression)));
}
function differentiateFunction(expression){
	return (stringy(toInfix(toPostfix(derivative(toTree(shunt(expression)))))));
}