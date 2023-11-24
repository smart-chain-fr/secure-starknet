import { showToastr } from '../actions/toastr';
import { ERROR } from '../model/constants';

export function handleError(dispatch, error, failFunction) {
  console.warn(error && error.response);
  if(error.response && error.response.status && error.response.data && error.response.data.error) {
    dispatch(showToastr(ERROR, error.response.data.error));
    dispatch(failFunction(error.response.data.error));
  } else if(error.response && error.response.status) {
    dispatch(showToastr(ERROR, error.response.status));
    dispatch(failFunction(error.response.status));
  } else {
    dispatch(showToastr(ERROR, error));
    dispatch(failFunction('Unknown error'));
  }
}

export function explicitError(code) {
  if(code === 400 || code === '400') return '400 Bad Request';
  if(code === 401 || code === '401') return '401 Unauthorized';
  if(code === 402 || code === '402') return '402 Payment Required';
  if(code === 403 || code === '403') return '403 Forbidden';
  if(code === 404 || code === '404') return '404 Not Found';
  if(code === 405 || code === '405') return '405 Method Not Allowed';
  if(code === 406 || code === '406') return '406 Not Acceptable';
  if(code === 407 || code === '407') return '407 Proxy Authentication Required';
  if(code === 408 || code === '408') return '408 Request Timeout';
  if(code === 409 || code === '409') return '409 Conflict';
  if(code === 410 || code === '410') return '410 Gone';
  if(code === 411 || code === '411') return '411 Length Required';
  if(code === 412 || code === '412') return '412 Precondition Failed';
  if(code === 413 || code === '413') return '413 Request Entity Too Large';
  if(code === 414 || code === '414') return '414 Request-URI Too Long';
  if(code === 415 || code === '415') return '415 Unsupported Media Type';
  if(code === 416 || code === '416') return '416 Requested Range Not Satisfiable';
  if(code === 417 || code === '417') return '417 Expectation Failed';
  if(code === 418 || code === '418') return '418 I\'m a teapot (RFC 2324)';
  if(code === 420 || code === '420') return '420 Enhance Your Calm (Twitter)';
  if(code === 422 || code === '422') return '422 Unprocessable Entity (WebDAV)';
  if(code === 423 || code === '423') return '423 Locked (WebDAV)';
  if(code === 424 || code === '424') return '424 Failed Dependency (WebDAV)';
  if(code === 425 || code === '425') return '425 Reserved for WebDAV';
  if(code === 426 || code === '426') return '426 Upgrade Required';
  if(code === 428 || code === '428') return '428 Precondition Required';
  if(code === 429 || code === '429') return '429 Too Many Requests';
  if(code === 431 || code === '431') return '431 Request Header Fields Too Large';
  if(code === 444 || code === '444') return '444 No Response (Nginx)';
  if(code === 449 || code === '449') return '449 Retry With (Microsoft)';
  if(code === 450 || code === '450') return '450 Blocked by Windows Parental Controls (Microsoft)';
  if(code === 451 || code === '451') return '451 Unavailable For Legal Reasons';
  if(code === 499 || code === '499') return '499 Client Closed Request (Nginx)';
  if(code === 500 || code === '500') return '500 Internal Server Error';
  if(code === 501 || code === '501') return '501 Not Implemented';
  if(code === 502 || code === '502') return '502 Bad Gateway';
  if(code === 503 || code === '503') return '503 Service Unavailable';
  if(code === 504 || code === '504') return '504 Gateway Timeout';
  if(code === 505 || code === '505') return '505 HTTP Version Not Supported';
  if(code === 506 || code === '506') return '506 Variant Also Negotiates (Experimental)';
  if(code === 507 || code === '507') return '507 Insufficient Storage (WebDAV)';
  if(code === 508 || code === '508') return '508 Loop Detected (WebDAV)';
  if(code === 509 || code === '509') return '509 Bandwidth Limit Exceeded (Apache)';
  if(code === 510 || code === '510') return '510 Not Extended';
  if(code === 511 || code === '511') return '511 Network Authentication Required';
  if(code === 598 || code === '598') return '598 Network read timeout error';
  if(code === 599 || code === '599') return '599 Network connect timeout error';
  return code;
}
