import { showToastr } from '../actions/toastr';
import { ERROR } from '../model/constants';

export default function get(object, ...levels) {
  try {
    let levelObject = object;
    levels.forEach((level) => {
      if(levelObject && level && levelObject[level]) levelObject = levelObject[level];
      else {
        throw new Error(`${JSON.stringify(levelObject)} does not have ${JSON.stringify(level)}`);
      }
    });
    return levelObject;
  } catch (e) {
    showToastr(ERROR, e.message); //NOT WORKING
    //console.log(e.message);
  }
}
