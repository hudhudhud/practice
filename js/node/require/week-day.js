var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
exports.name = function(number) { //有多个函数时，则挂属性到exports参数上
  return names[number]
}
exports.number = function(name) {
  return name.indexOf(name)
}

// var name="week-day"
//  if(!(name in myrequire.cache))
//     myrequire.cache[name]=exports

var month = myrequire("month")
exports.monthName = function(number) {
  return month.name(number)
}
exports.monthNumber = function(name) {
  return month.number(name)
}