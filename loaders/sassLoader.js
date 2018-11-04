const sass = require('node-sass');
const path = require('path');

module.exports = (data, file) => {
	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data: ', data)
	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file: ', file)
  try {
  	var v = sass.renderSync({data, file}).css.toString('utf8');
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', v)
    return v;
  } catch (e) {
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > ERROR: ', e)
    console.error(e);
  }
};

// module.exports = function processSass(data, filename) {
// 	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data: ', data)
// 	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > filename: ', filename)
//   var result;
//   result = sass.renderSync({
//     data: data,
//     file: filename
//   }).css;
//   var v = result.toString('utf8');
//   console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', v)
//   return v;
// };