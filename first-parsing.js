var fs = require("fs");
const readline = require('readline');

/**
 * remove &nbsp from anywhere
 */

// //UNICODE TO JSON WITH CHARS, 2ND PASS
// var fileC = fs.readFileSync("subtlex-1500");
// var subtlex = fileC.toString().replace(/,/g,"");
// var unicodeDB = []

// let rl = readline.createInterface({
//  input: fs.createReadStream('./extra/unicode.txt')
// });

// var id = pronunciation = definition = ''
// rl.on('line', function(line) {
//  var arr = line.split('	')
//  var code = arr[0].split('+')[1]
//  var charFromCode = code ? String.fromCodePoint(`0x${code}`) : 0x9C8B
//  //console.log(charFromCode)
//  if(subtlex.includes(charFromCode)){
//   if( arr[1]=='kDefinition' && arr[2]){
//     var cantIdx = arr[2].indexOf('(C') //cantonses def
//     definition = cantIdx > 0 ? arr[2].substring(0,cantIdx) : arr[2]
//     id = arr[0]
//    }
//    if(arr[1]=='kMandarin' && arr[2] && id==arr[0]){
//     id= arr[0].split('+')[1]
//     pronunciation = arr[2]
//     unicodeDB.push({
//       char: String.fromCodePoint(`0x${id}`),
//       pronunciation: pronunciation,
//       definition: definition
//     })
//     //console.log(unicodeDB[unicodeDB.length-1])
//     id = pronunciation = definition = ''
//    }
//    if(arr[1]=='kXHC1983'
//       && arr[2]
//       && arr[0].split('+')[1] == unicodeDB[unicodeDB.length-1].id){

//       var pron =arr[2].indexOf(' '>1)? arr[2].split(' ') : [arr[2]]
//       pron.forEach(function(v,i){pron[i] = pron[i].split(':')[1] })
//       unicodeDB[unicodeDB.length-1].pronunciation = pron.toString()
//     }
//  }
// });

// rl.on('close', function(){
//   //console.log(unicodeDB)
//   fs.writeFileSync('./unicode-subtlex-1500', JSON.stringify(unicodeDB,null,2))
// })

//UNICODE indexed by chars to files
var fileStr = fs.readFileSync("./extra/strokes-all.json");
var strChars = JSON.parse(fileStr.toString())
//var subtlex = fileC.toString().replace(/,/g,"");
var unicodeDB = {}
var id = pronunciation = definition = prevId = ''

let rl = readline.createInterface({
  input: fs.createReadStream('./extra/unicode.txt')
});

//idx reviewed double pinyings by char
var fileDou = fs.readFileSync('pinyin-reduction/unicode-subtlex-double-pinyin-reviewed')
var doublePin = JSON.parse(fileDou)
var doubPinIxd = {}
doublePin.forEach(unit=>{
  doubPinIxd[unit.hanzi] = {pinyin: unit.pinyin, literal: unit.literal}
})

rl.on('line', function (line) {
  var arr = line.split('	')
  var code = arr[0].split('+')[1]
  var charFromCode = code ? String.fromCodePoint(`0x${code}`) : 0x9C8B

  if (arr[1] == 'kDefinition' && arr[2]) {
    var cantIdx = arr[2].indexOf('(Cant.)') //cantonses def
    definition = cantIdx > 0 ? arr[2].substring(0, cantIdx).trim() : arr[2].trim()
    if (definition.includes('(')) definition = definition.replace(/\([^()]*\)/g, '').trim()
    if(definition.includes('simplified form'))
      definition = definition.substring(0, definition.indexOf('simplified form'))
    if(definition.includes('KangXi')) 
      definition = definition.substring(0, definition.indexOf('KangXi'))
    if(definition.includes('rad.')) 
      definition = definition.substring(0, definition.indexOf('rad.'))
    if(definition.includes('“') || definition.includes('”')){
        definition = definition.replace('“', '')
        definition = definition.replace('”', '')
    }
    if (definition.includes('same as' && definition.includes(','))){
      definition = definition.split(',').filter(k=>{if(!k.includes('same as'))return k}).toString().trim()
    } 
    id = arr[0]
  }
  if (arr[1] == 'kMandarin' && arr[2] && id == arr[0]) {
    id = arr[0].split('+')[1]
    prevId = id
    pronunciation = arr[2]
    unicodeDB[charFromCode] = {
      pronunciation: pronunciation,
      definition: definition
    }
    id = pronunciation = definition = ''
  }

  if (arr[1] == 'kXHC1983'
    && arr[2]
    && arr[0].split('+')[1] == prevId) {
    var pron = arr[2].indexOf(' ' > 1) ? arr[2].split(' ') : [arr[2]]
    pron.forEach(function (v, i) { pron[i] = pron[i].split(':')[1] })
    unicodeDB[charFromCode].pronunciation = pron.toString()
  }
});

rl.on('close', function () {
  Object.keys(strChars).forEach(char=>{
    if(unicodeDB[char]){
      if(doubPinIxd[char]) {
        unicodeDB[char].definition = doubPinIxd[char].literal
        unicodeDB[char].pronunciation = doubPinIxd[char].pinyin
        fs.writeFileSync('unicode-9000-idx-by-char/'+char+'.json', JSON.stringify(unicodeDB[char]))
      }
      // fs.writeFileSync('unicode-9000-idx-by-char/'+char+'.json', JSON.stringify(unicodeDB[char]))
    }  
  })
})
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

// var fileU = fs.readFileSync('./unicode-subtlex-strokes-1500')
// var unico = JSON.parse(fileU)
// var combined = []
// count = 0
// unico.forEach((e, i) => {
//   e.pronunciation.includes(' ')? console.log(e.char, e.pronunciation) : null
//   if (e.pronunciation.split(',').length>5)
//     //console.log(e.pronunciation)
//     combined.push(e.char)
// });
// 1==2
//fs.writeFileSync('./chars-multiple-pinyin', JSON.stringify(combined))


//TABLE MULTIPLE PINYIN
/*var fileMlt = fs.readFileSync('./chars-multiple-pinyin')
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
*/
/*
//PINYIN REDUCTION UNICODE-SUBTLEX-1500-REVIEWED
var fileOld = fs.readFileSync('./unicode-subtlex-1500')
var oldSubtlx = JSON.parse(fileOld)
var result = []
var reviewed = {}
let rl = readline.createInterface({
  input: fs.createReadStream('./pinyin-reduction/table-multiple-pinyin-reviewed.csv')
 });

rl.on('line',function(line){
  var arr = line.split(',')
  var char = arr[0]
  var pinyin, literal
  arr.slice(1,8).forEach(v=>{
    if(v.includes('*')) pinyin = v.split('*')[1]
  })
  arr.slice(8,arr.length).forEach(v2=>{
    if(v2.includes('*')) literal = v2.split('*')[1]
  })
  reviewed[char]= {pinyin, literal}
})
rl.on('close',()=>{
  //console.log(reviewed['上'])
  oldSubtlx.forEach((v,i)=>{
    if(reviewed[v.char]){
      // result.push({
      //   hanzi: v.char,
      //   pinyin: reviewed[v.char].pinyin.trim(),
      //   literal: reviewed[v.char].literal.trim()
      // })
      reviewed[v.char].pinyin == undefined || reviewed[v.char].literal == undefined ?
      result.push(v.char) : null
    }
  })
  //fs.writeFileSync('./pinyin-reduction/unicode-subtlex-1500-reviewed', JSON.stringify(result, null, 2))
  fs.writeFileSync('./pinyin-reduction/special-lesson-chars', JSON.stringify(result))
})
*/
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