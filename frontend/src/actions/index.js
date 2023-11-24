import * as toastrActions from './toastr';
import * as usersActions from './users';
import * as meActions from './me';
import * as contractsActions from './contracts';
import * as sendActions from './send';

let actions = {
  ...toastrActions,
  ...usersActions,
  ...contractsActions,
  ...meActions,
  ...sendActions
};

export default actions;
