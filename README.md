# bootstrap-react-redux-webpack-ssr-five

## Overview:

App is somewhat of a continuation of repo 'bootstrap-react-redux-webpack-ssr-four'.

### New warning received on both client and server in dev build:

`Warning: Failed context type: The context 'store' is marked as required in 'Component', but its value is 'undefined'`.

=========================================

https://react-redux.js.org/api/provider

context: You may provide a context instance. If you do so, you will need to provide the same context instance to all of your connected components as well. Failure to provide the correct context results in runtime error:

react-redux v6 uses new context not legacy context.

https://reactjs.org/docs/context.html
https://reactjs.org/docs/legacy-context.html

https://github.com/reduxjs/react-redux
