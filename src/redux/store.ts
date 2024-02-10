import { compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';

const enhancer = compose(
  composeWithDevTools(),
);

const store = createStore(rootReducer, enhancer);

export default store;
