/**
 * Uses the new JS struct
 * Indexes every char and its combinations
    * 1 char point to 2 and 3
    * 2 char points to 1 and 3
    * 3 or more char point to 1 and 2 char
 * Tested as a method to find combs in sentence and relationship trees
 */
var fs = require('fs')

const readline = require('readline');
var  CircularJSON = require('circular-json')
var FlattedJSON = require('flatted/cjs')

var fileChNw = fs.readFileSync('./results/new-db-1500.json')
//var fileChNw = JSON.stringify([{"char":{"hanzi":"怎么","pinyin":"zěnme","figurative":"how","literal":"how,interrogative"},"short":{"hanzi":["怎么样","不怎么"],"figurative":["how about","not quite"]},"long":{"hanzi":["你昨天怎么没来?","我不怎么想去"],"figurative":["why","not quite feel going"]},"id":57,"learnedId":57,"level":1,"consult":false}])



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

function splitComb(comb, char){
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
function cleanComb(arr){
  arr.forEach((v,i)=>{
    arr[i] = v.split(' ').join('')
  })
  return arr
}
//add single short combs
units.forEach((unit)=>{
  if(unit.short.hanzi && unit.short.hanzi.length>1 && unit.lesson.order && unit.char.hanzi.length==1){
    unit.short.hanzi = splitComb(unit.short.hanzi, '/')
    unit.short.hanzi = splitComb(unit.short.hanzi, ',')
    unit.short.hanzi = cleanComb(unit.short.hanzi)

    unit.short.hanzi.forEach((short, i)=>{
      
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
  else if(unit.lesson.order && unit.char.hanzi.length>1){
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
      unit.short.hanzi = splitComb(unit.short.hanzi, '/')
      unit.short.hanzi = splitComb(unit.short.hanzi, ',')
      unit.short.hanzi = cleanComb(unit.short.hanzi)

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

//add sentences
units.forEach(unit=>{
  if(unit.long.hanzi && unit.long.hanzi.length > 0){
    unit.long.hanzi = splitComb(unit.long.hanzi, '/') //split / and add to comb
    unit.long.hanzi.forEach(stc=>{
      if(stc.includes('(')) stc= stc.split(/[(].{1,10}[)]/gm).join('') //eliminate parenthesys
      if(!tree2[stc]) tree2[stc] = {}
      var lgt = stc.length
      for(i=0; i< lgt; i++){
        if(i==4) break
        splitExact(stc, i).forEach(group=>{
          if(tree2[group] && !tree2[group][stc] && group!=''){
            tree2[group][stc] = tree2[stc]
            tree2[stc][group] = tree2[group]
          }
        })
      }
    })
  }
})




1==2
fs.writeFileSync('./tree.json', CircularJSON.stringify(tree, null, 2))
fs.writeFileSync('./tree.json.min', CircularJSON.stringify(tree))
fs.writeFileSync('./tree-flatted.json', FlattedJSON.stringify(tree))

var testF = fs.readFileSync('./tree-flatted.json')
var parsedCircular = FlattedJSON.parse(testF)
1==2

