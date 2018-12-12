var month=["January","February","March","April","May","June","July","August","September","October","November","December"]
exports.name=function(number){
  return month[number]
}
exports.number=function(name){
  return month.indexOf(name)
}

// var name="month"
//  if(!(name in myrequire.cache))
//    myrequire.cache[name]=exports
 
var week=myrequire("week-day")
exports.weekName=function(number){
  return week.name(number)
}
exports.weekNumber=function(name){
  return week.number(name)
}