function stringy(arr){
	var str="";
	for(var i=0;i<arr.length;i++){
		str+=arr[i].txt+" ";
	}
	return str;
}
function differentiateFunction(expression){
	return (stringy(toInfix(toPostfix(derivative(toTree(shunt(expression)))))));
}