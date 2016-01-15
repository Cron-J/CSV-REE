var upperCase = function(str){
	if(str !== undefined)
      return str.toString().toUpperCase();
};

var lowerCase = function(str){
	if(str !== undefined)
      return str.toString().toLowerCase();
};

var substring = function(str, param1, param2) {
	if(str !== undefined)
	  return str.toString().substr(param1,param2);
}

exports.upperCase = upperCase;
exports.lowerCase = lowerCase;
exports.substring = substring;