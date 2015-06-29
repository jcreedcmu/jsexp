var fs = require("fs")
var peg = require("pegjs")
var parser = peg.buildParser(fs.readFileSync("grammar.peg", "utf8"))
var result = parser.parse(fs.readFileSync("input.txt", "utf8"))
render(result)
function render(sexps) {
sexps.forEach(render_one)
}
function render_one(sexp) {
console.log(compile(sexp))
}
function stringify_str_elm(e) {
if (typeof(e) == "string") {return(JSON.stringify(e))} else {return(compile(e))}
}
function compile(sexp) {
if (typeof(sexp) == "string") {return(sexp)}
if (typeof(sexp) == "number") {return(sexp)}
if (typeof(sexp) == "boolean") {return(sexp)}
if (sexp[0][0] == ".") {return(compile(sexp[1]) + sexp[0] + "(" + sexp.slice(2).map(compile).join(", ") + ")")}
if (sexp[0] == "get") {return(compile(sexp[1]) + "[" + compile(sexp[2]) + "]")}
if (sexp[0] == "if") {if (sexp[3] == null) {return("if (" + compile(sexp[1]) + ") {" + compile(sexp[2]) + "}")} else {return("if (" + compile(sexp[1]) + ") {" + compile(sexp[2]) + "} else {" + compile(sexp[3]) + "}")}}
if (sexp[0] == "def") {return("var " + sexp[1] + " = " + compile(sexp[2]))}
if (sexp[0] == "==") {return(compile(sexp[1]) + " == " + compile(sexp[2]))}
if (sexp[0] == "str") {return(sexp.slice(1).map(stringify_str_elm).join(" + "))}
if (sexp[0] == "defn") {return("function " + sexp[1] + "(" + sexp[2].slice(1).join(", ") + ") {\n" + sexp.slice(3).map(compile).join("\n") + "\n}")}
return(sexp[0] + "(" + sexp.slice(1).map(compile).join(", ") + ")")
}
