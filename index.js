var fs = require('fs')
const readline = require('readline');
var  CircularJSON = require('circular-json')

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

var single = {}
var short = {}
var long={}

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
      chars.split('').forEach(c=>single[c] = {})
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

//add single unit short combs 
units.forEach((unit)=>{
  if(unit.short.hanzi && unit.learnedId && unit.char.hanzi.length==1){
    unit.short.hanzi = cleanComb(unit.short.hanzi, '/')
    unit.short.hanzi = cleanComb(unit.short.hanzi, ',')

    unit.short.hanzi.forEach((short, idx)=>{
      if(short){
        single[unit.char.hanzi][idx] = {}
        short.split('').forEach((char)=>{
          if(single[char] && char!=unit.char.hanzi)
            single[unit.char.hanzi][idx][char] = single[char]
          else 
            single[unit.char.hanzi][idx][char]= {}                   
        })        
      }
    })
  }
  else if(unit.learnedId && unit.char.hanzi.length>1){
    
    //add multiple char unit to single
    unit.char.hanzi.split('').forEach(ch=>{
    if(!single[ch]){
      //in case I add new char out of subtlex from now on
        single[ch] = {} 
      } else {
        var position = Object.keys(single[ch]).length
        single[ch][position] = {}
        unit.char.hanzi.split('').forEach(c=>{
          if(ch != c){
          single[ch][position][c] = single[c]
          } else single[ch][position][c] = {}
        })
        
      }
    })

    //add multiple char unit short combs
    if(unit.short.hanzi.length > 0){
      unit.short.hanzi = cleanComb(unit.short.hanzi, '/')
      unit.short.hanzi = cleanComb(unit.short.hanzi, ',')
  
      unit.short.hanzi.forEach((short)=>{
        if(short){
          //calc position for each char of this short comb and initiate
          var positions = {}
          var chars = short.split('')
          var circularComb = {} 
          //calc comb positions forEach single and populate circComb
          chars.forEach((char)=>{
            positions[char] = Object.keys(single[char]).length
            single[char][positions[char]] = {}
            if(single[char]){
              circularComb[char] = single[char]
            }
            else { //new context char outside of subtlex 1500
              single[char]= {}       
              circularComb[char] = single[char]            
            }
          })
          //asign to specific single position, ignore root as circular
          chars.forEach(char=>{
            var circCombCopy = circularComb
            Object.keys(circCombCopy).forEach(key=>{
              if(key==char) circCombCopy[key] = {}
            })
            single[char][positions[char]] = circCombCopy
          })
        }
      })
    }
  }
})

1==2
fs.writeFileSync('./tree.json', CircularJSON.stringify({single, short, long}, null, 2))
fs.writeFileSync('./tree.json.min', CircularJSON.stringify(single))

// var testF = fs.readFileSync('./tree.json')
// var parsedCircular = CircularJSON.parse(testF)
// 1==2
