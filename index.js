var fs = require("fs");
const readline = require('readline');



/*
//FIRST DATA CONVERSION PASS
var file = fs.readFileSync("mychars.json");
var units = JSON.parse(file);
var newUnits = []

//i is for json, k is for reactored newUnits
for (let i = 0, k = 0; i < units.length; i++ , k++) {
  console.log(`i = ${i}, k=${k}`)
  var unit = { char: {}, short: {}, long: {} }
  newUnits.push(unit)

  //unlearned chars: combs, defs, learnedId, level, consult set to undefined 
  if (typeof(units[i].learnedId) === 'undefined') {
    newUnits[k].id = units[i].id
    newUnits[k].learnedId = undefined
    newUnits[k].level = undefined
    newUnits[k].consult = undefined
    newUnits[k].char.hanzi = units[i].char
    newUnits[k].char.pinyin = undefined
    newUnits[k].short.hanzi = undefined
    newUnits[k].short.figurative = undefined
    newUnits[k].long.hanzi = undefined
    newUnits[k].long.figurative = undefined
  } else { //char has been learned already

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
    if (isDoubleChar) {
      oldSingle = oldSingle.substring(1, oldSingle.length - 1)
      newUnits[k].char.figurative = units[i].definitions.single[1].trim()
    }
    newUnits[k].char.literal = oldSingle

    //empty combs, leave complete, curate space on cells
    var oldCombShort = units[i].combinations.short
    var oldDefShort = units[i].definitions.short
    var oldCombLong = units[i].combinations.long
    var oldDefLong = units[i].definitions.long

    if (oldCombShort.length > 1) {
      for (let x = oldCombShort.length - 1; x > -1; x--) {
        if (!oldCombShort[x]) {
          oldCombShort = oldCombShort.slice(0, x)
          oldDefShort = oldDefShort.slice(0, x)
        } else {
          oldCombShort[x] = oldCombShort[x].trim()
          //some combs don't have corresponding defs
          oldDefShort[x] = typeof (oldDefShort[x]) === 'undefined' ? '' : oldDefShort[x].trim()
        }
      }
    }
    if (oldCombLong.length > 1) {
      for (let m = oldCombLong.length - 1; m > -1; m--) {
        if (!oldCombLong[m]) {
          oldCombLong = oldCombLong.slice(0, m)
          oldDefLong = oldDefLong.slice(0, m)
        } else {
          oldCombLong[m] = oldCombLong[m].trim()
          oldDefLong[m] = typeof (oldDefLong[m]) === 'undefined' ||
            oldDefLong[m] === null ? '' : oldDefLong[m].trim()
        }
      }
    }

    newUnits[k].short.hanzi = oldCombShort
    newUnits[k].short.figurative = oldDefShort
    newUnits[k].long.hanzi = oldCombLong
    newUnits[k].long.figurative = oldDefLong

    //console.dir(newUnits[j])
  }


}

fs.writeFile('./new-db-struct.json', JSON.stringify(newUnits, null, 2), function (err) {
  if (err) console.log(err)
  console.log('Result saved!!')
})

*/

//SECOND DATA CONVERSION



/**
 * remove &nbsp from anywhere
 */

//UNICODE TO JSON WITH CHARS, 1ST PASS
var myCharsInUnicode = []
var file = fs.readFileSync("mychars.json");
var units = JSON.parse(file);
var unicodeDB = []

let rl = readline.createInterface({
 input: fs.createReadStream('unicode.txt')
});

let line_no = 0;

var id = pronunciation = definition = ''
rl.on('line', function(line) {
 line_no++;

 var arr = line.split('	')
 
 if( arr[1]=='kDefinition' && arr[2]){
  var cantIdx = arr[2].indexOf('(C') //cantonses def
  definition = cantIdx > 0 ? arr[2].substring(0,cantIdx) : arr[2]
  id = arr[0]
 }
 if(arr[1]=='kMandarin' && arr[2] && id==arr[0]){
  id= arr[0].split('+')[1]
  pronunciation = arr[2]
  unicodeDB.push({
    id: id,
    char: String.fromCodePoint(`0x${id}`),
    pronunciation: pronunciation,
    definition: definition
  })
  //console.log(unicodeDB[unicodeDB.length-1])
  id = pronunciation = definition = ''
 } 
 if(arr[1]=='kXHC1983' 
    && arr[2]   
    && arr[0].split('+')[1] == unicodeDB[unicodeDB.length-1].id){

    var pron =arr[2].indexOf(' '>1)? arr[2].split(' ') : [arr[2]] 
    pron.forEach(function(v,i){pron[i] = pron[i].split(':')[1] })
    unicodeDB[unicodeDB.length-1].pronunciation = pron.toString()
  }

});

rl.on('close', function(){
  //console.log(unicodeDB)
  fs.writeFileSync('./unicode-mine-all.txt', JSON.stringify(unicodeDB,null,2))
})




/*
units.forEach(element => {
 myCharsInUnicode.push(element.char.codePointAt(0).toString(16))
 
});*/
