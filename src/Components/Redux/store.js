import { createStore, compose } from "redux";
import counterReducer from "./reducer";

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(counterReducer, composeEnhancers());

export default store;
