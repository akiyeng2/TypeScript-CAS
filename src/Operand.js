function Operand(tok){
	if(tok.type==0){
		this.isVariable=true;
		this.value=null;
	}else if(tok.type==5){
		this.isVariable=false;
		if(tok.txt=="e"){
			this.value=Math.E;
		}else if(tok.txt=="pi"){
			this.value=Math.PI;
		}else{
			this.value=parseFloat(tok.txt,10);
		}
	}
	this.txt=tok.txt;

}
Operand.prototype.toString=function(){
	return this.txt;
};
Operand.prototype.evaluate=function(){
	return this.value;
};
Operand.prototype.differentiate=function(){
	return (this.isVariable)?operator("1"):operator("0");
};
