var fs = require("fs");
var newDb = JSON.parse(fs.readFileSync('migration/new-db-1500-byChar.json'))


result = {}
//double chars only have one preferred pron each
Object.keys(newDb).forEach(k => {
    if (newDb[k].lesson.order) {
        var newDbPinyin = newDb[k].char.pinyin
        //bye parenthesys/comments
        newDbPinyin  = newDbPinyin.split(/[(].{1,10}[)]/gm).join('')
        //two chars, one pron each
        newDbPinyin .split(',').forEach((pinyin,i) => {
            //one char, two pron each
            pinyin.split('/').forEach((py,j)=>{
                !result[py] ?
                    result[py] = new Set() : null
                result[py].add(k[i])
            })
        })
    }
})

Object.keys(result).forEach(key=>result[key] = Array.from(result[key]))

fs.writeFileSync('char-by-pinyin/char-by-pinyin.json', JSON.stringify(result, null, 2) )