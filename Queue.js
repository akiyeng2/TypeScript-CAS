function Queue(){
	var array=[];
	this.add=function(steve){
		array.unshift(steve);
	};
	this.remove=function(){
		return array.shift();
	};
	this.peek=function(){
		return array[0];
	};
	this.empty=function(){
		return (array.length===0);
	};
	this.getArray=function(){
		return array;
	};
}
