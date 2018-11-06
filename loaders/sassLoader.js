const sass = require('node-sass');
const path = require('path');

module.exports = (data, file) => {
  try {
    console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data: ', data)
    console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file: ', file)
  	var v = sass.renderSync({
      data: data, 
      file: file,
    }).css.toString('utf8')
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', v)
    return v;
  } catch (e) {
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > ERROR: ', e)
    console.error(e);
  }
};

// module.exports = (file) => {
//   sass.render({
//     data: `@import "sharedresources.scss";`,
//     // '@import "./src/scss/vue-globals";'
//     // data: '@import "../client/assets/scss/app/sharedresources.scss";',
//     file: file,
//     includePaths: ['./client/assets/scss/app/']
//   }, function(error, result) {
//     if (error) {
//       console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > error: ', error);
//     }
//     else {
//       console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', result.css.toString());
//       return result.css.toString('utf8');
//     }
//   });
// };
