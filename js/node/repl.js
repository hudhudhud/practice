const repl = require('repl');


function myEval(cmd, context, filename, callback) {
  callback(null, console.log(1));
}

repl.start({
  prompt: '>>>',
  eval: myEval
});