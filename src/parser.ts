module Parser {
	enum Types {NUMBER, OPERATOR, FUNCTION, LEFT, RIGHT, SEPARATOR};
	enum Operators {ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, EXPONENTIATION, UNARY_NEGATIVE};


	class Token {
		text : string;
		type : number;
		precedence : number;
		associativity : string;
		operatorType : number;

		constructor(text : string, previous : number = -1) {
			this.text = text
			if(! isNaN(Number(text))) {
				this.type = Types.NUMBER;
				delete this.precedence;
				delete this.associativity;
				delete this.operatorType;
			} else if(text.match(/^[a-z]+$/)) {
				delete this.associativity;
				delete this.operatorType;
				if(this.text.length == 1) {
					this.type = Types.NUMBER;
					delete this.precedence;
				} else {
					this.type = Types.FUNCTION;
					this.precedence = 10;
				} 
			} else if(this.text == "(" ) {
				this.type = Types.LEFT;
				delete this.precedence;
				delete this.associativity;
				delete this.operatorType;
			} else if(this.text == ")") {
				this.type = Types.RIGHT;
				delete this.precedence;
				delete this.associativity;
				delete this.operatorType;
			} else if(this.text == ",") {
				this.type = Types.SEPARATOR;
				delete this.precedence;
				delete this.associativity;
				delete this.operatorType;
			} else {
				this.type = Types.OPERATOR;
				this.associativity = "left";
				if(this.text == "+") {
					this.precedence = 1;
					this.operatorType = Operators.ADDITION;
				} else if(this.text == "-") {
					if(previous == -1 || (previous != Types.NUMBER && previous != Types.RIGHT)) {
						this.precedence = 9;
						this.associativity = "right";
						this.operatorType = Operators.UNARY_NEGATIVE;
					} else {
						this.precedence = 1;
						this.operatorType = Operators.SUBTRACTION;
					}
				} else if(this.text == "*") {
					this.precedence = 5;
					this.operatorType = Operators.MULTIPLICATION;
				} else if(this.text == "/") {
					this.precedence = 5;
					this.operatorType = Operators.DIVISION;
				} else if(this.text == "^") {
					this.precedence = 10;
					this.operatorType = Operators.EXPONENTIATION;
				} else {
					throw new SyntaxError("Unidentified token");
				}
			} 
		}


		checkAddition(other : Token) : boolean {
			if(other.type == Types.OPERATOR) {
				return (this.associativity == "left" && this.precedence == other.precedence) || 
						this.precedence < other.precedence
			}

			return false;
		}

		
	}

	function tokenize (expression : string) : Token[] {
		var regex = /[A-Za-z_][A-Za-z_\d]*|\(|\)|\+|\-|\*|\/|\^|\,|\d+(?:\.\d*)?/g;
		expression = expression.replace(/\s+/g, '');
		var matches = expression.match(regex);

		var tokens : Token[] = [];
		for(var i = 0; i < matches.length; i++) {
			if(i == 0) {
				tokens.push(new Token(matches[i], -1))
			} else {
				tokens.push(new Token(matches[i], tokens[i-1].type));
			}
		}

		for(var i = 1; i < tokens.length; i++) {
			var token = tokens[i];
			var previous = tokens[i-1];
			if(token.type == Types.NUMBER && (previous.type == Types.NUMBER || previous.type == Types.RIGHT)) {
				tokens.splice(i, 0, new Token("*"));
			} else if(token.type == Types.LEFT && (previous.type == Types.NUMBER || previous.type == Types.RIGHT)) {
				tokens.splice(i, 0, new Token("*"));
			} else if(token.type == Types.FUNCTION && (previous.type == Types.NUMBER || previous.type == Types.RIGHT)) {
				tokens.splice(i, 0, new Token("*"));
			}
		}



		return tokens;

	}

	function shunt(tokens : Token[]) : Token[] {

		var stack : Token[] = [];
		var output : Token[] = [];


		for(var i = 0; i < tokens.length; i++) {
			var token : Token = tokens[i];
			if(token.type == Types.NUMBER) {
				output.push(token);
			} else if(token.type == Types.FUNCTION) {
				stack.push(token);
			} else if(token.type == Types.SEPARATOR) {
				while(stack.length > 0 && stack[stack.length - 1].type != Types.LEFT) {
					output.push(stack.pop());
				}
				
				
			} else if(token.type == Types.OPERATOR) {
				while(stack.length > 0 && token.checkAddition(stack[stack.length - 1])) {
					output.push(stack.pop());
				}
				stack.push(token);
			} else if(token.type == Types.LEFT) {
				stack.push(token);
			} else if(token.type == Types.RIGHT) {
				while(stack[stack.length - 1].type != Types.LEFT) {
					output.push(stack.pop());
				}
				stack.pop();
				if(stack.length > 0 && stack[stack.length - 1].type == Types.FUNCTION) {
					output.push(stack.pop());
				}
			}
		}

		while(stack.length > 0) {
			output.push(stack.pop());
		}
		return output;
	}

	var t : Token[] = shunt(tokenize("2x+3"));
	var str : String = "";
	for(var i = 0; i < t.length; i++) {
		str+=t[i].text + " ";
	}
	console.log(str);
}