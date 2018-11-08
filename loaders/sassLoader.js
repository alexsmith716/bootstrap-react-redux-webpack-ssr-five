const sass = require('node-sass');
const path = require('path');

module.exports = (data, file) => {
  try {
    console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data: ', data)
    console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file: ', file)
    var v = sass.renderSync({data, file}).css.toString('utf8');
    console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > result: ', v)
    return v;
  } catch (e) {
  	console.log('>>>>>>>>>>>>>>>>>>> SASSLOADER.JS > ERROR: ', e)
    console.error(e);
  }
};

// >>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data:  
// // @import '../../../assets/scss/app/functions.scss';
// // @import '../../../assets/scss/app/variables.scss';
// // @import '../../../assets/scss/app/mixins.scss';
// @import '../../../assets/scss/app/sharedresources.scss';
// 
// @import '../scss/AppScss1.scss';
// @import '../scss/AppScss2.scss';

// >>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file:  ../bootstrap-react-redux-webpack-ssr-five/client/containers/App/styles/App.scss

// >>>>>>>>>>>>>>>>>>> SASSLOADER.JS > data:  
// .colorPurpleCssLocal {
//   color: #9B30FF;
// }
// 
// .colorOliveCssLocal {
//   color: #808000;
// }
// 
// .colorCrimsonCssLocal {
//   color: #DC143C;
// }

// >>>>>>>>>>>>>>>>>>> SASSLOADER.JS > file:  ../bootstrap-react-redux-webpack-ssr-five/client/containers/App/css/AppCss1.css
