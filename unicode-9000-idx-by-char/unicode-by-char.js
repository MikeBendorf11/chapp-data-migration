var fs = require("fs");
const readline = require('readline');

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