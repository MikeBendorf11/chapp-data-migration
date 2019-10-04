var fs = require('fs')
const readline = require('readline');
var  CircularJSON = require('circular-json')
var FlattedJSON = require('flatted/cjs')

//minify json to remove ['']
// var fileChNw = fs.readFileSync('./units-new-struct.json')
// var units = JSON.stringify(JSON.parse(fileChNw))
// 1==2
// fs.writeFileSync('./units-new-struct.json.min',units)

//clean some issues from plain text
var fileChNw = fs.readFileSync('./units-new-struct.json')
var units = JSON.parse(
  fileChNw.toString()
  .split('&nbsp;').join('') //remove nbsp
  .split(/[(].{1,10}[)]/gm).join('')
  .split('#').join('')
  //.split('?').join('')
)

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
  else if(unit.learnedId && unit.char.hanzi.length==2){
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
  if(unit.char.hanzi.length > 3){
    console.log(unit.char.hanzi)
  }
}
  //add multiple char unit short combs
  /** skip 他 我 她 你
   * find groups of 2 within 3, 3 within 4 (recursive till ?)
    * list these groups under their parent group
    * if a comb doesn't have a group
      * list it under the single
    * should sentences be keys? nop!?
    */
  //triple char and so
  
)

1==2
fs.writeFileSync('./tree.json', CircularJSON.stringify(tree, null, 2))
fs.writeFileSync('./tree.json.min', CircularJSON.stringify(tree))
fs.writeFileSync('./tree-flatted.json', FlattedJSON.stringify(tree))

var testF = fs.readFileSync('./tree-flatted.json')
var parsedCircular = FlattedJSON.parse(testF)
1==2

