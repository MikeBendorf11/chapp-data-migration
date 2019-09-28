var fs = require('fs')
const readline = require('readline');

//minify json to remove ['']
// var fileChNw = fs.readFileSync('./units-new-struct.json')
// var units = JSON.stringify(JSON.parse(fileChNw))
// 1==2
// fs.writeFileSync('./units-new-struct.json.min',units)

//singles
var fileChNw = fs.readFileSync('./units-new-struct.json.min')
var units = JSON.parse(
  fileChNw.toString()
  .split('&nbsp;').join('') //remove nbsp
  .split(/[(].{1,6}[)]/gm).join('')
  .split('#').join('')
  //.split('?').join('')
)

var single = {}
var short = {}
var long={}

units.forEach((unit)=>{

  if(unit.learnedId && unit.char.hanzi.length==1){
    single[unit.char.hanzi] = {children: unit.short.hanzi.concat(unit.long.hanzi)}
    if(unit.short.hanzi.length>0){
      unit.short.hanzi.forEach(sht=>{ //create short[x]
        sht = sht.trim()
        if(sht.includes('/')){ //split to more sht arrs
          sht.split('/').forEach(s=>{
            s = s.trim()
            if(!short[s]){
              short[s] = {children:[]}
            }
          })
        }
        else if(sht.includes(',')){ //split to more sht arrs
          sht.split(',').forEach(s=>{
            s = s.trim()
            if(!short[s]){
              short[s] = {children:[]}
            }
          })
        }
        else if(!short[sht] && sht){ //add the sht chars length=1
          short[sht] ={children:[]}
        }

        if(unit.long.hanzi.length>0){
          unit.long.hanzi.forEach(lng=>{
            if(lng.includes(sht)){
              short[sht].children.push(lng)
            }
          })
        }
      })
    }
  }
})

1==2
fs.writeFileSync('./tree.json', JSON.stringify({single, short, long}, null, 2))

