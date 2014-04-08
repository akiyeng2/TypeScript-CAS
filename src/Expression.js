function Expression(tree,variables){
	if(typeof tree==="string"){
		this.tree=toTree(shunt(tree));
	}else if(tree instanceof Operator || tree instanceof Operand){
		this.tree=tree;
	}else{
		throw new TypeError("Operator or string expected, not found");
	}
	this.variables=variables;
	
}
Expression.prototype.toString=function(){
	return displayTree(this.tree);
};
Expression.prototype.evaluate=function(variables){
	return this.tree.evaluate();
};
Expression.prototype.differentiate=function(){
	return this.tree.differentiate();
};
Expression.prototype.standardize=function(){
	return this.tree.makeCommutative().standardize([]);
};