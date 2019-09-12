var fs = require("fs");
const readline = require('readline');
var file = fs.readFileSync("mychars.json");
var units = JSON.parse(file);

/*
var newUnits = []

//i is for json, k is for reactored newUnits
for(let i = 50, k=0; i< 60; i++, k++){
  console.log(`i = ${i}, k=${k}`)
  var unit = {char:{}, short:{}, long:{}}
  newUnits.push(unit)
  var oldSingle = units[i].definitions.single[0].trim()
  var isDoubleChar = units[i].char.length > 1 || false
    
  newUnits[k].id = units[i].id
  newUnits[k].learnedId = units[i].learnedId
  newUnits[k].level = units[i].level
  newUnits[k].consult = units[i].consult
  newUnits[k].char.hanzi = units[i].char
  newUnits[k].char.pinyin = units[i].pronunciation
  
  //parenthesis and
  //single char doesn't have figurative
  if(isDoubleChar){
    oldSingle = oldSingle.substring(1, oldSingle.length-1)
    newUnits[k].char.figurative = units[i].definitions.single[1].trim()
  }
  newUnits[k].char.literal = oldSingle

  //empty combs, leave complete, curate space on cells
  var oldCombShort = units[i].combinations.short
  var oldDefShort = units[i].definitions.short
  var oldCombLong = units[i].combinations.long
  var oldDefLong = units[i].definitions.long

  if(oldCombShort.length > 1){
    for(let x=oldCombShort.length-1; x>-1; x--){
      if(!oldCombShort[x]){
        oldCombShort = oldCombShort.slice(0,x)
        oldDefShort = oldDefShort.slice(0,x)
      } else {
        oldCombShort[x] = oldCombShort[x].trim()
        //some combs don't have corresponding defs
        oldDefShort[x] = typeof(oldDefShort[x])==='undefined' ? '': oldDefShort[x].trim()
      }
    }
  }
  if(oldCombLong.length > 1){
    for(let m=oldCombLong.length-1; m>-1; m--){
      if(!oldCombLong[m]){
        oldCombLong = oldCombLong.slice(0,m)
        oldDefLong = oldDefLong.slice(0,m)
      }else {
        oldCombLong[m] = oldCombLong[m].trim()
        oldDefLong[m] = typeof(oldDefLong[m])==='undefined'? '' :
        oldDefLong[m].trim()
      }
    }
  }

  newUnits[k].short.hanzi = oldCombShort
  newUnits[k].short.figurative = oldDefShort
  newUnits[k].long.hanzi = oldCombLong
  newUnits[k].long.figurative = oldDefLong
  
  //console.dir(newUnits[j])
}

fs.writeFile('./new-db-struct.json', JSON.stringify(newUnits,null, 2), function(err){
  if(err) console.log(err)
  console.log('Result saved!!')
})
*/




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

 //UNICODE DB PARSE
var myCharsInUnicode = []
var file = fs.readFileSync("mychars.json");
var content = JSON.parse(file);

content.forEach(element => {
  myCharsInUnicode.push(element.char.codePointAt(0).toString(16))
  //console.log(element.char.codePointAt(0).toString(16))
});

let rl = readline.createInterface({
  input: fs.createReadStream('unicode.txt')
});

let line_no = 0;

//var unihan = []
var pinyin = new Set();

rl.on('line', function(line) {
  line_no++;

  var arr = line.split('	')
  if(arr[1]=='kMandarin' && arr[2]){// || arr[1]=='kDefinition')
    pinyin.add(arr[2])
    //console.log(arr[2])
  }
});

rl.on('close', function(x){
  var pinyinList = []
  pinyin.forEach(p=>pinyinList.push(p))
  fs.writeFile('./pinyin-list', pinyinList.toString(), 
    function (err) {
      if(err) console.log(err)
      console.log('success')
  })
  console.log(pinyinList.toString())
})

//console.log(pinyinList.toString())