var fs = require("fs");
var peg = require("pegjs");
var parser = peg.buildParser(fs.readFileSync("grammar.peg", "utf8"));
var result = parser.parse(fs.readFileSync("input.txt", "utf8"));
render(result)
function stringify_str_elm(e) {
if (typeof(e) == "string") {return(JSON.stringify(e))} else {return(compile(e))}
}

function compile(sexp) {
  if (typeof(sexp) == "string" || typeof(sexp) == "number" || typeof(sexp) == "boolean") {
    return sexp;
  }
//  console.log(sexp, typeof(sexp));

  if (sexp[0].match(/^\./)) {
    return sexp[1] + sexp[0] + "(" + sexp.slice(2).map(compile).join(", ") + ")";
  }
  switch (sexp[0]) {
  case "if":
    if (sexp[3] != null)
      return "if (" + compile(sexp[1]) + ") {" + compile(sexp[2]) + "} else {" + compile(sexp[3]) + "}";
    else
      return "if (" + compile(sexp[1]) + ") {" + compile(sexp[2]) + "}";
  case "def": return "var " + sexp[1] + " = " + compile(sexp[2]) + ";";
  case "==": return compile(sexp[1]) + " == " + compile(sexp[2]);
  case "str": return sexp.slice(1).map(stringify_str_elm).join(" + ");
  case "defn": return "function " + sexp[1] + "(" + sexp[2].slice(1).join(", ") + ") {\n" + sexp.slice(3).map(compile).join("\n") + "\n}";
  default: return (sexp[0] + "(" + sexp.slice(1).map(compile).join(", ") + ")");
  }
}
function render(sexps) {
  sexps.forEach(function(sexp) {
    console.log(compile(sexp));
  });
}
