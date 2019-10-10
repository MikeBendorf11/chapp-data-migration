/**
 * Uses the new JS struct
 * Indexes every char and its combinations
    * 1 char point to 2 and 3
    * 2 char points to 1 and 3
    * 3 or more char point to 1 and 2 char
 * Tested as a method to find combs in sentence and relationship trees
 * Single ch defs come from unicode, multiple ch defs from my db
 */
var fs = require('fs')
const readline = require('readline');
var  CircularJSON = require('circular-json')
var FlattedJSON = require('flatted/cjs')

var fileChNw = fs.readFileSync('./units-new-struct.json')
// var fileChNw = JSON.stringify([{"char":{"hanzi":"怎么","pinyin":"zěnme","figurative":"how","literal":"how,interrogative"},"short":{"hanzi":["怎么样","不怎么"],"figurative":["how about","not quite"]},"long":{"hanzi":["你昨天怎么没来?","我不怎么想去"],"figurative":["why","not quite feel going"]},"id":57,"learnedId":57,"level":1,"consult":false}])
var unicode = {}
JSON.parse(fs.readFileSync('./pinyin-reduction/unicode-subtlex-double-pinyin-reviewed')
.toString()).forEach(part=>{
  unicode[part.hanzi] = {pinyin: part.pinyin, literal: part.literal}
})

JSON.parse(fs.readFileSync('./unicode-subtlex-1500')
.toString()).forEach(part=>{
  if(!unicode[part.char])
    unicode[part.char] = {pinyin: part.pronunciation, literal: part.definition}
})

//clean some issues from plain text
var units = JSON.parse(
  fileChNw.toString()
  .split('&nbsp;').join('') //remove nbsp
  .split(/[(].{1,10}[)]/gm).join('') //parenthesis info
  .split('#').join('') //consult
  //.split('?').join('')
)

//first parse, all singles and multiples within
var tree = {}

//define singles
units.forEach((unit)=>{
  addSingle(unit.char.hanzi)
  addSingle(unit.short.hanzi)
  addSingle(unit.long.hanzi)
  // tree[unit.char.hanzi]['pronunciation'] = unicode[unit.char.hanzi]['pronunciation']
  // tree[unit.char.hanzi]['definition'] = unicode[unit.char.hanzi]['definition']
})

for(key in tree){
  if(unicode[key]){
    //parse unicode pronunciation
    var literal = unicode[key]['literal']
    if(literal.includes(',',';'))
      literal = literal.split(';').join(',').split(',').map(key=>{if(key.includes(' '))return})
    tree[key]['pinyin'] = unicode[key]['pinyin']
    var literal = unicode[key]['literal']
    tree[key]['literal'] = unicode[key]['literal']
  } else { //chars outside 1500 grab my pinyin and pronun, or include in subtlex?

  }

}

function addSingle(chars){
  if(typeof(chars)==='string'){
    chars = cleanInput(chars)
    if(chars){
      chars.split('').forEach(c=>tree[c] = {})
    }else return
  }
  else if(typeof(chars)==="object"){
    if(chars.length>0){
      chars.forEach(c=>addSingle(c))
    } else return
  }
}
//chinese sentences have more weird chars
function cleanInput(str){
  var ignore = ' ,，、：!！?？.。“”/enw29'
  ignore.split('').forEach(i=>str = str.split(i).join(''))
  return str
}

function cleanComb(comb, char){
  comb.forEach((c,i)=>{ //check / split and add to arr
    if(c.includes(char)){
      var partials = c.split(char)
      comb[i] = partials[0].trim()
      partials.forEach((p, i)=>{
        if(i!=0) comb.push(p.trim())
      })
    }
  })
  return comb;
}

//add single short combs
units.forEach((unit)=>{
  if(unit.short.hanzi && unit.learnedId && unit.char.hanzi.length==1){
    unit.short.hanzi = cleanComb(unit.short.hanzi, '/')
    unit.short.hanzi = cleanComb(unit.short.hanzi, ',')

    unit.short.hanzi.forEach((short)=>{
      var result = {}
      if(short){
        short.split('').forEach((char)=>{
            result[char] = tree[char]
        })
        tree[unit.char.hanzi][short] = result
      }
    })
  }
  //add double char unit
  else if(unit.learnedId && unit.char.hanzi.length>1){
    var result = {}
    unit.char.hanzi.split('').forEach(ch=>{
      if(tree[ch]){
        result[ch] = tree[ch]
        tree[ch][unit.char.hanzi] = result
      } else {
         //in case I add new char out of subtlex from now on
         tree[ch] = {}
      }
    })
    //double char short combs need to point to either unit.char[0] or 1
    if(unit.short.hanzi.length > 0){
      unit.short.hanzi = cleanComb(unit.short.hanzi, '/')
      unit.short.hanzi = cleanComb(unit.short.hanzi, ',')

      unit.short.hanzi.forEach((short)=>{
        if(short){
          var result = {}

          short.split('').forEach((char)=>{
            tree[char][short] = {}
            if(tree[char]){
              result[char] = tree[char]
              tree[char][short] = result
            }
            else { //new context char outside of subtlex 1500
              tree[char]= {}
              result[char] = tree[char]
            }
          })
        }
      })
    }
  }
})

function splitExact(string, limit){
  var groups = []
  for(var i=0, j=limit; j<=string.length; i++, j++){
    groups.push(string.substring(i,j))
  }
  return groups
}

//send branches longer than one main to root
var tree2 = {}
Object.keys(tree).forEach(key=>{
  tree2[key] = tree[key]
  var subtree = Object.keys(tree[key])
  if(subtree.length>0){
    subtree.forEach(comb=>{
      tree2[comb] = tree[key][comb]
    })
  }
})

//check length 3 split into 2, point 3 to 2 and 2 to 3
Object.keys(tree2).forEach(key=>{
  if(key.length>2){
    splitExact(key, 2).forEach(group=>{
      if(tree2[group]) {
        tree2[key][group] = tree2[group]
        tree2[group][key] = tree2[key]
        delete tree2[key][group[0]]
        delete tree2[key][group[1]]
        // console.log(key, group)
      }
    })
  }
})


/*extract doubles or triples from str */
var str = "等到你过生日再那天打开"

processSentence(str)
function processSentence(str){
  for(var i=1; i<5; i++){
    splitExact(str, i).forEach(gr=>{
      if(tree2[gr]) console.log(gr)
    })
  }
}



1==2
fs.writeFileSync('./tree.json', CircularJSON.stringify(tree, null, 2))
fs.writeFileSync('./tree.json.min', CircularJSON.stringify(tree))
fs.writeFileSync('./tree-flatted.json', FlattedJSON.stringify(tree))

var testF = fs.readFileSync('./tree-flatted.json')
var parsedCircular = FlattedJSON.parse(testF)
1==2

