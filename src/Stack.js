function Stack(arr){
	var array;
	if(arr===undefined){
		array=[];
	}else{
		array=arr;
	}
	this.empty=function(){
		return (array.length===0);
	};
	this.peek=function(){
		return array[array.length-1];
	};
	this.pop=function(){
		return array.pop();
	};
	this.push=function(steve){
		array.push(steve);
	};
	this.length=function(){
		return array.length;
	};
	this.getArray=function(){
		return array;
	};
}