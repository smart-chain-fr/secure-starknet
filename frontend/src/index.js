import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';
import configureStore, { history } from './configureStore';

const store = configureStore();
const render = () => {
  ReactDOM.render(
    <div className="App">
      <Provider store={store}>
        <App history={history} />
      </Provider>
    </div>,
    document.getElementById('root')
  );
};
render();

serviceWorker.unregister();
