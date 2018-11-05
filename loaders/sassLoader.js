const sass = require('node-sass');
const path = require('path');

module.exports = (data, file) => {
	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data: ', data)
	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file: ', file)
  try {
  	var v = sass.renderSync({
      data: data, 
      file: file
    }).css.toString('utf8');
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', v)
    return v;
  } catch (e) {
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > ERROR: ', e)
    console.error(e);
  }
};

// includePaths: ['../client/assets/scss/app/']
