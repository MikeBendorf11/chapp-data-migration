var fs = require("fs");
const readline = require('readline');


var file = fs.readFileSync("mychars.json");
var units = JSON.parse(file);

1 || 1
var newUnits = []

for(let i = 50, j=0; i< 60; i++, j++){
  var unit = {char:{}, short:{}, long:{}}
  newUnits.push(unit)
  var oldSingle = units[i].definitions.single[0]
  var isDoubleChar = units[i].char.length > 1 || false
  
  //parenthesis 
  oldSingle = isDoubleChar ? oldSingle.substring(1, oldSingle.length-2) : oldSingle
  //single char doesn't have figurative
  if(!isDoubleChar)
    newUnits[j].char.figurative = undefined
  else  
    newUnits[j].char.figurative = units[i].definitions.single[1].trim()

  //empty combs, leave complete
  var oldCombShort = units[i].combinations.short
  var oldDefShort = units[i].definitions.short
  var oldCombLong = units[i].combinations.long
  var oldDefLong = units[i].definitions.long

  if(oldCombShort.length > 1){
    for(let i=oldCombShort.length-1; i>-1; i--){
      if(!oldCombShort[i]){
        oldCombShort = oldCombShort.slice(0,i)
        oldDefShort = oldDefShort.slice(0,i)
      }
    }
  }
  if(oldCombLong.length > 1){
    for(let i=oldCombLong.length-1; i>-1; i--){
      if(!oldCombLong[i]){
        oldCombLong = oldCombLong.slice(0,i)
        oldDefLong = oldDefLong.slice(0,i)
      }
    }
  }
  
  newUnits[j].id = units[i].id
  newUnits[j].char.hanzi = units[i].char
  newUnits[j].char.literal = oldSingle
  
  newUnits[j].short.hanzi = units[i].combinations.short
  console.dir(newUnits[j])
}

console.dir(newUnits)
1 || 1




/**
 * definitions.single[0] = char.literal
 * definitions.single[1] = char.figurative
 * combinations.short = short.hanzi
 * combinations.long = long.hanzi
 * definitions.short = short.figurative
 * definitions.long = long.figurative
 * id, level, learnedId, level, consult => same
 * learnedId determines is char is pending 
 * short and long.pinyin dinamically calc from char.literal
 *    ['a,b','c,d','e,f'] each is a str of comma separated char.pinyin
 * char.trace 
 */

 /* //UNICODE DB PARSE
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
});*/