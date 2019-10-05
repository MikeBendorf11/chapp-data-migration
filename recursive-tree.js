var combinations = ['zzasdfg', 'fxx', 'a', 'dhs', 'fx', 'cd','asdfx','as' ]
var combStr = combinations.toString()
var tree = {}
var maxLength = 0
var organized = {}

process(combinations[6],combinations[1].length-1)

function process(string, limit, prevGroup){
  var groups = splitExact(string, limit)
  
  groups.forEach(group=>{ 
    if(group.length>1){
      process(group, limit-1, groups)
    } else {
      tree[group] = {}
    }
    if(group == 'sd' || group == 'd')
      1 == 2
    if(combStr.includes(`,${string},`) && string.includes(group)){
      tree[group] = {}
      tree[group][string] = {}
    }
    
    groups || prevGroup || string || combinations
  })
}
1 || 2
function splitExact(string, limit){
  var groups = []
  for(var i=0, j=limit; j<=string.length; i++, j++){
    groups.push(string.substring(i,j))
  }
  return groups
}