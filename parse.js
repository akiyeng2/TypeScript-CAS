function tokenize(expression) {
	var tokens = [ "[A-Za-z_][A-Za-z_\d]*", "\\(", "\\)", "\\+", "-", "\\*",
			"/", "\\^", "\\d+(?:\\.\\d*)?" ];
	var rtok = new RegExp("\\s*(?:(" + tokens.join(")|(") + "))\\s*", "g");
	var toks = [], p;
	rtok.lastIndex = p = 0; // reset the regex

	while (rtok.lastIndex < expression.length) {

		var match = rtok.exec(expression);
		// Make sure we found a token, and that we found
		// one without skipping garbage

		if (!match || rtok.lastIndex - match[0].length !== p)
			throw new SyntaxError();

		// Figure out which token we matched by finding the non-null group
		for ( var i = 1; i < match.length; ++i) {
			if (match[i]) {
				var type, precedence = null, associativity = null, operands = null, txt = match[i];
				if (i == 1) {
					if (match[i].length == 1 || match[i] == "pi") {
						type = 0;
						if (match[i] == "e" || match[i] == "pi") {
							type = 5;
						}

					} else {
						type = 1;
						operands = 1;
					}
				} else if (i == 2) {
					type = 2;
				} else if (i == 3) {
					type = 3;
				} else if (i <= 8) {
					type = 4;
					operands = 2;
					if (i == 4) {
						precedence = 1;
						associativity = 0;
					} else if (i == 5) {
						precedence = 1;
						associativity = 0;
						var previous = (toks.length > 0) ? toks[toks.length - 1]
								: null;
						if (toks.length == 0 || previous.type == 4
								|| previous.type == 2) {
							precedence = 50;
							associativity = 1;
							txt = "!";
							operands = 1;
						}
					} else if (i == 6 || i == 7) {
						precedence = 5;
						associativity = 0;
					} else {
						precedence = 10;
						associativity = 1;
					}

				} else {
					type = 5;
				}
				toks.push({
					id : i,
					txt : txt,
					type : type,
					associativity : associativity,
					precedence : precedence,
					operands : operands
				});

				// remember the new position in the string
				p = rtok.lastIndex;
				break;
			}
		}
	}
	return toks;
}

function shunt(expression) {
	var array = tokenize(expression);
	var VARIABLE = 0;
	var FUNCTION = 1;
	var OPEN_PARENTHESIS = 2;
	var CLOSE_PARENTHESIS = 3;
	var OPERATOR = 4;
	var NUMBER = 5;
	var LEFT_ASSOC = 0;
	var output = new Queue();
	var stack = new Stack();
	for ( var i = 0; i < array.length; i++) {
		var token = array[i];
		if (token.type == NUMBER || token.type == VARIABLE) {
			output.add(token);
		} else if (token.type == FUNCTION) {
			stack.push(token);
		} else if (token.type == OPERATOR) {

			while (!stack.empty()
					&& (stack.peek().type == OPERATOR && ((token.associativity == LEFT_ASSOC && token.precedence == stack
							.peek().precedence) || (token.precedence < stack
							.peek().precedence)))) {

				output.add(stack.pop());
			}
			stack.push(token);
		} else if (token.type == OPEN_PARENTHESIS) {

			stack.push(token);
		} else if (token.type == CLOSE_PARENTHESIS) {
			while (stack.peek() !== undefined
					&& stack.peek().type !== OPEN_PARENTHESIS) {

				output.add(stack.pop());

			}
			stack.pop();
			if (stack.peek() !== undefined && stack.peek().type == FUNCTION) {
				output.add(stack.pop());
			}
		}

	}
	while (!stack.empty()) {
		output.add(stack.pop());
	}

	return output.getArray().reverse();
}