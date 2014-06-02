var Parser;
(function (Parser) {
    var Types;
    (function (Types) {
        Types[Types["NUMBER"] = 0] = "NUMBER";
        Types[Types["OPERATOR"] = 1] = "OPERATOR";
        Types[Types["FUNCTION"] = 2] = "FUNCTION";
        Types[Types["LEFT"] = 3] = "LEFT";
        Types[Types["RIGHT"] = 4] = "RIGHT";
        Types[Types["SEPARATOR"] = 5] = "SEPARATOR";
    })(Types || (Types = {}));
    ;
    var Operators;
    (function (Operators) {
        Operators[Operators["ADDITION"] = 0] = "ADDITION";
        Operators[Operators["SUBTRACTION"] = 1] = "SUBTRACTION";
        Operators[Operators["MULTIPLICATION"] = 2] = "MULTIPLICATION";
        Operators[Operators["DIVISION"] = 3] = "DIVISION";
        Operators[Operators["EXPONENTIATION"] = 4] = "EXPONENTIATION";
        Operators[Operators["UNARY_NEGATIVE"] = 5] = "UNARY_NEGATIVE";
    })(Operators || (Operators = {}));
    ;

    var Token = (function () {
        function Token(text, previous) {
            if (typeof previous === "undefined") { previous = -1; }
            this.text = text;
            if (!isNaN(Number(text))) {
                this.type = 0 /* NUMBER */;
                delete this.precedence;
                delete this.associativity;
                delete this.operatorType;
            } else if (text.match(/^[a-z]+$/)) {
                delete this.associativity;
                delete this.operatorType;
                if (this.text.length == 1) {
                    this.type = 0 /* NUMBER */;
                    delete this.precedence;
                } else {
                    this.type = 2 /* FUNCTION */;
                    this.precedence = 10;
                }
            } else if (this.text == "(") {
                this.type = 3 /* LEFT */;
                delete this.precedence;
                delete this.associativity;
                delete this.operatorType;
            } else if (this.text == ")") {
                this.type = 4 /* RIGHT */;
                delete this.precedence;
                delete this.associativity;
                delete this.operatorType;
            } else if (this.text == ",") {
                this.type = 5 /* SEPARATOR */;
                delete this.precedence;
                delete this.associativity;
                delete this.operatorType;
            } else {
                this.type = 1 /* OPERATOR */;
                this.associativity = "left";
                if (this.text == "+") {
                    this.precedence = 1;
                    this.operatorType = 0 /* ADDITION */;
                } else if (this.text == "-") {
                    if (previous == -1 || (previous != 0 /* NUMBER */ && previous != 4 /* RIGHT */)) {
                        this.precedence = 9;
                        this.associativity = "right";
                        this.operatorType = 5 /* UNARY_NEGATIVE */;
                    } else {
                        this.precedence = 1;
                        this.operatorType = 1 /* SUBTRACTION */;
                    }
                } else if (this.text == "*") {
                    this.precedence = 5;
                    this.operatorType = 2 /* MULTIPLICATION */;
                } else if (this.text == "/") {
                    this.precedence = 5;
                    this.operatorType = 3 /* DIVISION */;
                } else if (this.text == "^") {
                    this.precedence = 10;
                    this.operatorType = 4 /* EXPONENTIATION */;
                } else {
                    throw new SyntaxError("Unidentified token");
                }
            }
        }
        Token.prototype.checkAddition = function (other) {
            if (other.type == 1 /* OPERATOR */) {
                return (this.associativity == "left" && this.precedence == other.precedence) || this.precedence < other.precedence;
            }

            return false;
        };
        return Token;
    })();

    function tokenize(expression) {
        var regex = /[A-Za-z_][A-Za-z_\d]*|\(|\)|\+|\-|\*|\/|\^|\,|\d+(?:\.\d*)?/g;
        expression = expression.replace(/\s+/g, '');
        var matches = expression.match(regex);

        var tokens = [];
        for (var i = 0; i < matches.length; i++) {
            if (i == 0) {
                tokens.push(new Token(matches[i], -1));
            } else {
                tokens.push(new Token(matches[i], tokens[i - 1].type));
            }
        }

        for (var i = 1; i < tokens.length; i++) {
            var token = tokens[i];
            var previous = tokens[i - 1];
            if (token.type == 0 /* NUMBER */ && (previous.type == 0 /* NUMBER */ || previous.type == 4 /* RIGHT */)) {
                tokens.splice(i, 0, new Token("*"));
            } else if (token.type == 3 /* LEFT */ && (previous.type == 0 /* NUMBER */ || previous.type == 4 /* RIGHT */)) {
                tokens.splice(i, 0, new Token("*"));
            } else if (token.type == 2 /* FUNCTION */ && (previous.type == 0 /* NUMBER */ || previous.type == 4 /* RIGHT */)) {
                tokens.splice(i, 0, new Token("*"));
            }
        }

        return tokens;
    }

    function shunt(tokens) {
        var stack = [];
        var output = [];

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type == 0 /* NUMBER */) {
                output.push(token);
            } else if (token.type == 2 /* FUNCTION */) {
                stack.push(token);
            } else if (token.type == 5 /* SEPARATOR */) {
                while (stack.length > 0 && stack[stack.length - 1].type != 3 /* LEFT */) {
                    output.push(stack.pop());
                }
            } else if (token.type == 1 /* OPERATOR */) {
                while (stack.length > 0 && token.checkAddition(stack[stack.length - 1])) {
                    output.push(stack.pop());
                }
                stack.push(token);
            } else if (token.type == 3 /* LEFT */) {
                stack.push(token);
            } else if (token.type == 4 /* RIGHT */) {
                while (stack[stack.length - 1].type != 3 /* LEFT */) {
                    output.push(stack.pop());
                }
                stack.pop();
                if (stack.length > 0 && stack[stack.length - 1].type == 2 /* FUNCTION */) {
                    output.push(stack.pop());
                }
            }
        }

        while (stack.length > 0) {
            output.push(stack.pop());
        }
        return output;
    }

    var t = shunt(tokenize("2x+3"));
    var str = "";
    for (var i = 0; i < t.length; i++) {
        str += t[i].text + " ";
    }
    console.log(str);
})(Parser || (Parser = {}));
