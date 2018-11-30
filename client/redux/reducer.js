import { connectRouter } from 'connected-react-router';
import auth from './modules/auth';
import notifs from './modules/notifs';
import info from './modules/info';

// root reducer
export default function createReducers(history, asyncReducers) {
  return {
  	router: connectRouter(history),
    online: (v = true) => v,
    notifs,
    auth,
    info,
    ...asyncReducers,
  };
}