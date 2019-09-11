var fs = require("fs");
const readline = require('readline');


var file = fs.readFileSync("mychars.json");
var content = JSON.parse(file);

var myCharsInUnicode = []

content.forEach(element => {
  myCharsInUnicode.push(element.char.codePointAt(0).toString(16))
  //console.log(element.char.codePointAt(0).toString(16))
});

let rl = readline.createInterface({
  input: fs.createReadStream('unicode.txt')
});

let line_no = 0;

var unihan = []
rl.on('line', function(line) {
  line_no++;
  var arr = line.split('	')
  if(arr[1]=='kMandarin' || arr[1]=='kDefinition')
  console.log();
});