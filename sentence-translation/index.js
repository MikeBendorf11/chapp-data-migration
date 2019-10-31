var fs = require("fs");
const readline = require('readline');

result = []

let rls = readline.createInterface({
  input: fs.createReadStream('./sentence-translation/combined.csv')
});

var count = 0
rls.on('line', function(line){
    var arr = line.split('$')
    result.push({
        char: arr[0].trim(),
        sentence: arr[1].trim(),
        translation: arr[2].trim()
    })
})

rls.on('close', ()=>{
    fs.writeFileSync('./sentence-translation/long-result.json.min', JSON.stringify(result))
})