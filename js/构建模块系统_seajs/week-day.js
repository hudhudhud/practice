var mod = imports('./mod.js')

var names = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

exports.name = function(number) {
  return names[mod(number, 7)];
};

exports.number = function(name) {
  return names.indexOf(name);
};