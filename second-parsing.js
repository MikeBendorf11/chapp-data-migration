
//unicode just chars all (easier to find that regex for hanzi code)

var fs = require("fs");
const readline = require('readline');

var result = prevChar = ''

let rl = readline.createInterface({
  input: fs.createReadStream('./extra/unicode.txt')
 });

rl.on('line',function(line){
  var arr = line.split('	')
  var code = arr[0].split('+')[1]
  var charFromCode = code ? String.fromCodePoint(`0x${code}`) : null
  if(charFromCode!=prevChar){
    result+=charFromCode
    prevChar = charFromCode
  }
  else  
    prevChar = charFromCode
})
rl.on('close',()=>{
  fs.writeFileSync('./unicode-all-chars', result)
})