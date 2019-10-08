/**
 * Uses the new JS struct
 * Indexes every char and its combinations
 * Lists them with back references and separately
 * Tested as a method to find combs in sentence and relationship trees
 * Single ch defs come from unicode, multiple ch defs from my db
 */
var fs = require('fs')
const readline = require('readline');
var  CircularJSON = require('circular-json')
var FlattedJSON = require('flatted/cjs')

//clean some issues from plain text
var fileChNw = fs.readFileSync('./units-new-struct.json')
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
})

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

    unit.short.hanzi.forEach((short, idx)=>{
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
    if(unit.short.hanzi.length > 0){
      unit.short.hanzi = cleanComb(unit.short.hanzi, '/')
      unit.short.hanzi = cleanComb(unit.short.hanzi, ',')
  
      unit.short.hanzi.forEach((short)=>{
        if(short && short.length==2){
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

//check length 3 split into 2, add to tree2[] if match
Object.keys(tree2).forEach(key=>{
  if(key.length>2){
    splitExact(key, 2).forEach(group=>{
      if(tree2[group]) {
        tree2[key][group] = tree2[group]
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

