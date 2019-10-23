var fs = require("fs");
const readline = require('readline');


//  WRITING FINAL RESULTS
var file = fs.readFileSync("../units-old.json");
var filestx15 = fs.readFileSync("../subtlex-1500")
var units = JSON.parse(file);
var newUnits = []

//i is for json, k is for reactored newUnits
for (let i = 0, k = 0; i < units.length; i++ , k++) {
 // console.log(`i = ${i}, k=${k}`)
  var unit = { lesson: {}, char: {}, short: {}, long: {} }
  newUnits.push(unit)

  //unlearned chars: combs, defs, learnedId, level, consult set to undefined
  if (typeof(units[i].learnedId) === 'undefined') {
    newUnits[k].lesson.relevance = units[i].id
    newUnits[k].lesson.order = undefined
    newUnits[k].lesson.level = undefined
    newUnits[k].lesson.consult = undefined
    
    newUnits[k].char.hanzi = units[i].char
    newUnits[k].char.pinyin = undefined
    newUnits[k].short.hanzi = undefined
    newUnits[k].short.figurative = undefined
    newUnits[k].long.hanzi = undefined
    newUnits[k].long.figurative = undefined
  } else { //char has been learned already

    var oldSingle = units[i].definitions.single[0].trim()
    var isDoubleChar = units[i].char.length > 1 || false
    
    newUnits[k].lesson.notes = ''
    newUnits[k].lesson.relevance = units[i].id
    newUnits[k].lesson.order = units[i].learnedId
    newUnits[k].lesson.level = units[i].level
    newUnits[k].lesson.consult = units[i].consult
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

//adding the remaning up to 1500 from subtlex
var flag = false
filestx15.toString().split(',').forEach((ch, i, a)=>{
  if(ch=='犯') flag = true
  if(flag){
    newUnits.push({
      lesson: {relevance: i+3},
      char: {ch}, short: {}, long: {}
    })
  }
})

fs.writeFile('new-db-1500.json', JSON.stringify(newUnits, null, 2), function (err) {
  if (err) console.log(err)
  console.log('Result saved!!')
})

