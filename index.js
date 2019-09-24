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

/**
 * remove &nbsp from anywhere
 */
/*
//UNICODE TO JSON WITH CHARS, 2ND PASS
var fileC = fs.readFileSync("subtlex-1500");
var subtlex = fileC.toString().replace(/,/g,"");
var unicodeDB = []

let rl = readline.createInterface({
 input: fs.createReadStream('unicode.txt')
});

var id = pronunciation = definition = ''
rl.on('line', function(line) {
 var arr = line.split('	')
 var code = arr[0].split('+')[1]
 var charFromCode = code ? String.fromCodePoint(`0x${code}`) : 0x9C8B 
 //console.log(charFromCode)
 if(subtlex.includes(charFromCode)){
  if( arr[1]=='kDefinition' && arr[2]){
    var cantIdx = arr[2].indexOf('(C') //cantonses def
    definition = cantIdx > 0 ? arr[2].substring(0,cantIdx) : arr[2]
    id = arr[0]
   }
   if(arr[1]=='kMandarin' && arr[2] && id==arr[0]){
    id= arr[0].split('+')[1]
    pronunciation = arr[2]
    unicodeDB.push({
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
 }
});

rl.on('close', function(){
  //console.log(unicodeDB)
  fs.writeFileSync('./unicode-subtlex-1500', JSON.stringify(unicodeDB,null,2))
})*/


//1500 SUBTLEX, JUST CHARS
/*
let rl = readline.createInterface({
  input: fs.createReadStream('SUBTLEX-CH-WF')
});
 var lineC = 0;
 var result = []
rl.on('line', function(line){
  
  var arr = line.split('	')
  result.push(arr[0])
  lineC++
  if(lineC>=1500) rl.close()

})

rl.on('close', function(){
  fs.writeFileSync('./subtlex-chars-only', result.toString())
})*/

//UNICODE SUBTLEX 1500 TOO SLOW
/*
var fileU = fs.readFileSync('./unicode-json-all.txt')
var fileS = fs.readFileSync('./subtlex-1500')

var unico = JSON.parse(fileU)
var arrS = fileS.toString().split(',')
var subtlSet = new Set(arrS)
var result = []

unico.forEach(function(v){
  //console.log(v)
  if(subtlSet.has(v.char)) result.push({
    char: v.char,
    pronunciation: v.pronunciation,
    definition: v.definition
  })
})

fs.writeFileSync('./unicode-subtlex-1500', JSON.stringify(result, null, 2))*/

//GET CHAR WITH MULTIPLE PINYIN FROM UNICODE
/*
var fileU = fs.readFileSync('./unicode-subtlex-1500')
var unico = JSON.parse(fileU)
var combined = []
count = 0
unico.forEach((e, i) => {
  if (e.pronunciation.split(',').length>5)
    //console.log(e.pronunciation)
    combined.push(e.char)
});

fs.writeFileSync('./chars-multiple-pinyin', JSON.stringify(combined))
*/

//TABLE MULTIPLE PINYIN
var fileMlt = fs.readFileSync('./chars-multiple-pinyin')
var mlt = new Set(JSON.parse(fileMlt))
var fileAllU = fs.readFileSync('./unicode-subtlex-1500')
var allU = JSON.parse(fileAllU)

var final =  ''
var maxPronun = ['','','','','','','']

allU.forEach((v,i)=>{
  if(mlt.has(v.char)){
    v.pronunciation.split(',').forEach((val,idx)=>{
      maxPronun[idx]=val 
    })
    final += v.char+','
          + maxPronun + ','
          + v.definition.split(',').join(' /').split(';').join(' /') 
          + '\n'
  }
  maxPronun = ['','','','','','','']
})

1==2
fs.writeFileSync('./table-multiple-pinyin.csv', final)

/*
//FROM STROKE ALL TO STROKE 1500
var fileS = fs.readFileSync('./strokes-all.json')
var stroke = JSON.parse(fileS)
var fileX = fs.readFileSync("./subtlex-1500");
var subtlex = fileX.toString().replace(/,/g,"");

result = {}

for(stk in stroke){
  if(subtlex.includes(stk)){
    result[stk]=stroke[stk]
  }
}

fs.writeFileSync('./strokes-subtlex-1500',JSON.stringify(result, null, 2))
*/
/*
//add stroke data to unicode-subtlex-1500
var fileU = fs.readFileSync('./unicode-subtlex-1500')
var unicode = JSON.parse(fileU)
var fileS = fs.readFileSync('./strokes-subtlex-1500')
var subtlex = JSON.parse(fileS)

result = []
unicode.forEach((v,i)=>{
  subtlex[v.char].pronunciation = v.pronunciation
  subtlex[v.char].definition = v.definition

  fs.writeFileSync(`./chars/${v.char}.json`,JSON.stringify(subtlex[v.char]))
  
  // result.push({
  //   char: v.char,
  //   pronunciation: v.pronunciation,
  //   definition: v.definition,
  //   strokes: subtlex[v.char].strokes,
  //   medians: subtlex[v.char].medians
  // })
})*/

//fs.writeFileSync('./unicode-subtlex-strokes-1500', JSON.stringify(result, null, 2))

/*
var unit = new Unit(
  {
    id: 12,
    learnedId: 22,
    level: 1,
    consult: true,
    
    char:{ 
      hanzi: '就是', //char
      pinyin: 'jiùshi', //pronunciation
      literal: 'just, yes', //definitions.single[0]
      figurative: 'truly', ////definitions.single[1]
    },
    short:{
      hanzi: ["就要"," 成就", ""], //combinations.short
      pinyin: ["","",""],
      //literal: can be derived from unit.root.literal
      figurative: [ 'will', 'achieve', ''], //definitions.short
    },
    long:{
      hanzi: ["#,因为就要下雨了" ,
             "这不是什么大不了的成就这不是什么大不了的成就",""], //comb.long
      pinyin: ["","",""],
      //literal: can be derived from unit.root.literal
      figurative: ["","",""], //definitions.long
    }
  }
)

*/