var fs = require("fs")
var peg = require("pegjs")
var parser = peg.buildParser(fs.readFileSync("grammar.peg", "utf8"))
var result = parser.parse(fs.readFileSync("input.txt", "utf8"))
render(result)
function render(sexps) {
var env = {}
sexps.forEach(function (sexp) {
console.log(compile(env, sexp))
})
}
function stringify_str_elm(env,e) {
if (typeof(e) == "string") {return(JSON.stringify(e))} else {return(compile(env, e))}
}

function compile(env,sexp) {
var compile_env = function (sexp) {
return(compile(env, sexp))
}
if (typeof(sexp) == "string") {return(sexp)}
if (typeof(sexp) == "number") {return(sexp)}
if (sexp[0]) {if (sexp[0][0] == ".") {return(compile_env(sexp[1]) + sexp[0] + "(" + sexp.slice(2).map(compile_env).join(", ") + ")")}}
var macro = env[sexp[0]]
if (macro) {return(compile_env(macro(sexp, compile_env)))}
if (sexp[0] == "get") {return(compile_env(sexp[1]) + "[" + compile_env(sexp[2]) + "]")}
if (sexp[0] == "set") {return(compile_env(sexp[1]) + "[" + compile_env(sexp[2]) + "] = " + compile_env(sexp[3]))}
if (sexp[0] == "debug") {return(JSON.stringify(env))}
if (sexp[0] == "defmacro") {env[sexp[1]] = eval("(" + compile_env(sexp[2]) + ")")
return("")}
if (sexp[0] == "if") {if (sexp[3] == null) {return("if (" + compile_env(sexp[1]) + ") {" + compile_env(sexp[2]) + "}")} else {return("if (" + compile_env(sexp[1]) + ") {" + compile_env(sexp[2]) + "} else {" + compile_env(sexp[3]) + "}")}}
if (sexp[0] == "def") {return("var " + sexp[1] + " = " + compile_env(sexp[2]))}
if (sexp[0] == "==") {return(compile_env(sexp[1]) + " == " + compile_env(sexp[2]))}
if (sexp[0] == "str") {return(sexp.slice(1).map(function (exp) {
return(stringify_str_elm(env, exp))
}).join(" + "))}
if (sexp[0] == "defn") {return("function " + sexp[1] + "(" + sexp[2].slice(1).join(", ") + ") {\n" + sexp.slice(3).map(compile_env).join("\n") + "\n}")}
if (sexp[0] == "fn") {return("function (" + sexp[1].slice(1).join(", ") + ") {\n" + sexp.slice(2).map(compile_env).join("\n") + "\n}")}
if (sexp[0] == "map") {return("{}")}
return(sexp[0] + "(" + sexp.slice(1).map(compile_env).join(", ") + ")")
}
