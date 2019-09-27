const fs = require('fs')
const readline = require('readline');

//minify json to remove ['']
// var fileChNw = fs.readFileSync('./units-new-struct.json')
// var units = JSON.stringify(JSON.parse(fileChNw))
// 1==2
// fs.writeFileSync('./units-new-struct.json.min',units)
// 1==2

//singles
var fileChNw = fs.readFileSync('./units-new-struct.json.min')
var units = JSON.parse(
  fileChNw.toString()
  .split('&nbsp;').join('') //remove nbsp
  
)

var single = {}
var short = {}
var long={}

units.forEach((unit)=>{

  if(unit.learnedId && unit.char.hanzi.length==1){
    single[unit.char.hanzi] = {children: unit.short.hanzi.concat(unit.long.hanzi)}
    if(unit.short.hanzi.length>0){
      unit.short.hanzi.forEach(sht=>{
        if(!short[sht]){
          short[sht] = {children:[]}
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
