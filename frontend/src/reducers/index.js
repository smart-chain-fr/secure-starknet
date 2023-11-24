import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { default as toastr } from './toastr';
import { default as users } from './users';
import { default as me } from './me';
import { default as contracts } from './contracts';
import { default as send } from './send';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  toastr,
  users,
  me,
  contracts,
  send
});

export default rootReducer;
