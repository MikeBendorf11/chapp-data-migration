var arr = ['asdfg', 'asdf','as', 'df', 'a', 's']
var tree = {}
var maxLength = 0
var organized = {}
arr.forEach(x=>{
  maxLength = x.length>maxLength? x.length: maxLength
})
for(i=1; i<=maxLength; i++){
  organized[i] = []
  arr.forEach(x=>{
    if(x.length == i) organized[i].push(x)
  })
}
arr.toString().split(',').join('').split('').forEach(ch=>{
  tree[ch] = {}
})
arr.forEach(x=>addPyramidal(x, tree))

function addPyramidal(string, tree){ 
  var groups = splitExact(string, string.length-1)
  if(groups[0].length>2)
    groups.forEach(group=>addPyramidal(group, tree))
  else{
    groups.forEach(group=>{
      group.split('').forEach(ch=>{
        if(group.includes(ch))
          tree[ch][group] = string
        else 
          tree[ch] = string
      })
    })
  }
  groups.forEach(group=>{
    if(tree[group][groups])
      tree[group][groups] = string
    else 
      tree[group] = string
  })
  
  /*
  if(string.length == 3){
    var doubles = splitExact(string, 2)
    string.split('').forEach((char)=>{
      doubles.forEach(double=>{
        if(tree[ch][double])
          tree[ch][double] = string
        else
          tree[ch] = string
      })
    })
  }
  else if(string.length ==4){
    var tripples = splitExact(string, 3)
    tripples.forEach(tripple=>{
      addPyramidal(tripple, tree)
    })
  }*/
}

//length is how many characters per split
function splitExact(string, limit){
  var groups = []
  for(var i=0, j=limit; j<=string.length; i++, j++){
    groups.push(string.substring(i,j))
  }
  return groups
}