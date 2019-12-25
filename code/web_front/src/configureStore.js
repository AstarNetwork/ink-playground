import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers';

const loggerMiddleware = createLogger({
  diff:true,
  collapsed:true,
})

export default (preloadedState) => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
  )
)
